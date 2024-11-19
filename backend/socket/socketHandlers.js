const pool = require("../db");
const { v4: uuidv4 } = require("uuid");

// Query to insert live users
const insertLiveUser = async (project_id, fileId, username) => {
    if (!username || !fileId) {
        return;
    }
    try {
        await pool.query(
            "UPDATE live_users SET is_active_in_tab = FALSE WHERE username = $1 AND project_id = $2",
            [username, project_id]
        );

        const results = await pool.query(
            "SELECT * FROM live_users WHERE file_id = $1 AND username = $2 AND project_id = $3",
            [fileId, username, project_id]
        );
        if (results.rows.length) {
            try {
                await pool.query(
                    "UPDATE live_users SET is_active_in_tab = TRUE, is_live = TRUE, live_users_timestamp = CURRENT_TIMESTAMP WHERE file_id = $1 AND username = $2 AND project_id = $3",
                    [fileId, username, project_id]
                );
            } catch (err) {
                // console.error("Error updating live user:", err);
                // throw err;
            }
        } else {
            try {
                await pool.query(
                    `
            INSERT INTO live_users (file_id, project_id, username, is_active_in_tab, is_live, live_users_timestamp)
            VALUES ($1, $2, $3, TRUE, TRUE, CURRENT_TIMESTAMP)
            ON CONFLICT (file_id, username) DO NOTHING;
            `,
                    // "INSERT INTO live_users (file_id, project_id, username, is_active_in_tab, is_live, live_users_timestamp) VALUES ($1, $2, $3, TRUE, TRUE, CURRENT_TIMESTAMP);",
                    [fileId, project_id, username]
                );
            } catch (err) {
                // console.error("Error inserting live user:", err);
                // throw err;
            }
        }
    } catch (err) {
        // console.error("Error getting live user:", err);
        // throw err;
    }
};

// Query to remove live users
const removeLiveUser = async (fileId, username) => {
    const query = "DELETE FROM live_users WHERE file_id = $1 AND username = $2;";
    await pool.query(query, [fileId, username]);
};

const removeActiveLiveUser = async (username) => {
    const query = `UPDATE live_users SET is_live = FALSE WHERE username = $1;`;
    await pool.query(query, [username]);
};

// Query to get live users in a file
const getLiveUsersInFile = async (project_id, fileId, username) => {
    const query = `SELECT f.*, lu.*, f.file_id AS id FROM files AS f LEFT JOIN live_users AS lu ON f.file_id = lu.file_id WHERE lu.file_id = $1 AND lu.username = $2 AND lu.project_id = $3;`; //f.project_id = $1;
    const res = await pool.query(query, [fileId, username, project_id]);
    return res.rows;
};

const getALiveUserInFile = async (fileId, username) => {
    const query = `SELECT * FROM live_users WHERE file_id = $1 AND username = $2;`;
    const res = await pool.query(query, [fileId, username]);
    return res.rows[0];
};

const getAllLiveUserInFile = async (fileId) => {
    const query = `SELECT lu.*, u.profile_image AS image FROM live_users AS lu JOIN users AS u ON u.username = lu.username WHERE file_id = $1`;
    const res = await pool.query(query, [fileId]);
    return res.rows;
};

const insertAndGetNewNodeToFileExplorer = async (
    username,
    project_id,
    new_node_parent_id,
    name,
    is_folder
) => {
    const uniqueIdFileTree = uuidv4(); //file_tree_id is file_id
    const insertQuery = `INSERT INTO file_tree (file_tree_id, project_id, parent_id, name, is_folder) VALUES ($1, $2, $3, $4, $5)`; //f.project_id = $1;
    await pool.query(insertQuery, [
        uniqueIdFileTree,
        project_id,
        new_node_parent_id,
        name,
        is_folder,
    ]);

    if (!is_folder) {
        const file_extension = name.split(".").pop().toLowerCase();
        await pool.query(
            `
        INSERT INTO files (file_id, project_id, file_created_by, file_name, file_extension)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (file_id) DO NOTHING;
        `,
            [uniqueIdFileTree, project_id, username, name, file_extension]
        );
    }

    const getQuery = `SELECT * FROM file_tree WHERE file_tree_id = $1`; //f.project_id = $1;
    const result = await pool.query(getQuery, [uniqueIdFileTree]);

    return result.rows[0];
};

const deleteFileAndChildren = async (fileTreeId) => {
    // Step 1: Get the file_tree_ids of the node and its descendants
    const getDescendantsQuery = `
      WITH RECURSIVE descendants AS (
          SELECT file_tree_id
          FROM file_tree
          WHERE file_tree_id = $1
          UNION ALL
          SELECT f.file_tree_id
          FROM file_tree f
          INNER JOIN descendants d ON f.parent_id = d.file_tree_id
      )
      SELECT file_tree_id FROM descendants;
    `;

    try {
        // Get all the descendants
        const descendantsResult = await pool.query(getDescendantsQuery, [
            fileTreeId,
        ]);


        for (let i = descendantsResult.rows.length - 1; i >= 0; i--) {
            const { file_tree_id } = descendantsResult.rows[i];

            await pool.query(
                "DELETE FROM file_tree_expand_user WHERE file_tree_id = $1",
                [file_tree_id]
            );
        }

        for (let i = descendantsResult.rows.length - 1; i >= 0; i--) {
            const { file_tree_id } = descendantsResult.rows[i];

            await pool.query("DELETE FROM file_tree WHERE file_tree_id = $1", [
                file_tree_id,
            ]);
        }

        for (let i = descendantsResult.rows.length - 1; i >= 0; i--) {
            const { file_tree_id } = descendantsResult.rows[i];

            await pool.query("DELETE FROM live_users WHERE file_id = $1", [
                file_tree_id,
            ]);
        }

        for (let i = descendantsResult.rows.length - 1; i >= 0; i--) {
            const { file_tree_id } = descendantsResult.rows[i];

            await pool.query("DELETE FROM files WHERE file_id = $1", [file_tree_id]);
        }
    } catch (err) {
        // console.error("Error deleting files:", err);
    }
};

const insertNewLog = async (file_id, newLog) => {
    const { username, origin, removed, text, from_line, from_ch, to_line, to_ch, log_timestamp } = newLog;

    const query = `INSERT INTO logs (
        file_id, 
        username,
        origin,
        removed, 
        text,
        from_line,
        from_ch,
        to_line,
        to_ch,
        log_timestamp
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
    `;

    const parameters = [file_id, username, origin, removed, text, from_line, from_ch, to_line, to_ch, log_timestamp];

    try {
        await pool.query(query, parameters);
    } catch (error) {
        // console.error("Error inserting new log:", error);
    }
};

const insertChatMessage = async (project_id, username, message, time) => {
    const query = `INSERT INTO chat (project_id, username, message, time) VALUES ($1, $2, $3, $4);`;
    const parameters = [project_id, username, message, time];

    try {
        await pool.query(query, parameters);
    } catch (error) {
        // console.error("Error inserting chat message:", error);
    }
};

const updateLastOpened = async (project_id, username) => {
    const query =
        `
        UPDATE project_owners
        SET last_opened = CURRENT_TIMESTAMP
        WHERE project_id = $1
        AND username = $2;
        `;
    try {
        await pool.query(query, [project_id, username]);
    } catch (error) {
        // console.log(error);
    }
};

const insertLiveUserIfNotExist = async (project_id, username) => {

    const query =
        `
        INSERT INTO project_live_users (project_id, username)
        VALUES ($1, $2)
        ON CONFLICT (project_id, username) DO NOTHING;
        `;

    try {
        await pool.query(query, [project_id, username]);
    } catch (error) {
        // console.log(error);
    }
};



const socketHandlers = (io) => {
    io.on("connection", (socket) => {
        socket.setMaxListeners(20);

        socket.on("editor:join-project", async ({ project_id, username, image }) => {
            socket.join(project_id);
            console.log("project_id", project_id);
            console.log("username", username);
            console.log("image", image);

            await updateLastOpened(project_id, username);
            // await pool.query(
            //     `
            //     UPDATE project_owners
            //     SET last_opened = CURRENT_TIMESTAMP
            //     WHERE project_id = $1
            //     AND username = $2;
            //     `,
            //     [project_id, username]
            // );

            await insertLiveUserIfNotExist(project_id, username);
            // await pool.query(
            //     `
            //     INSERT INTO project_live_users (project_id, username)
            //     VALUES ($1, $2)
            //     ON CONFLICT (project_id, username) DO NOTHING;
            //     `,
            //     [project_id, username]
            // );

            io.to(project_id).emit("editor:live-user-joined", { username, image });

            socket.on(
                "file-explorer:insert-node",
                async ({ new_node_parent_id, name, is_folder }) => {
                    const new_node = await insertAndGetNewNodeToFileExplorer(
                        username,
                        project_id,
                        new_node_parent_id,
                        name,
                        is_folder
                    );
                    io.to(project_id).emit("file-explorer:insert-node", new_node);
                }
            );

            socket.on("file-explorer:delete-node", async ({ node_id }) => {
                await deleteFileAndChildren(node_id);
                io.to(project_id).emit("file-explorer:delete-node", { node_id });
            });

            socket.on("code-editor:send-change", async (data) => {
                socket.broadcast.to(project_id).emit("code-editor:receive-change", data);
                const { file_id, newLog } = data;
                await insertNewLog(file_id, newLog);
            });

            socket.on("code-editor:send-all-cursors", ({ fileId }) => {
                socket.broadcast.to(project_id).emit("code-editor:send-all-cursors", { fileId });
                socket.on("code-editor:get-all-users-cursors", (data) => {
                    socket.broadcast.to(project_id).emit("code-editor:get-all-users-cursors", data);
                });
            });

            socket.on("code-editor:send-cursor", (data) => {
                io.to(project_id).emit("code-editor:receive-cursor", data);
            });

            socket.on("code-editor:remove-cursor", (data) => {
                socket.broadcast.to(project_id).emit("code-editor:remove-cursor", data);
            });

            socket.on("code-editor:load-live-users", async ({ file_id }) => {
                //send to personal
                const allUsers = await getAllLiveUserInFile(file_id);
                socket.emit("code-editor:load-live-users", { allUsers });
            });

            socket.on("code-editor:join-file", async ({ file_id }) => {
                await insertLiveUser(project_id, file_id, username);

                //send to all other users
                const aUser = await getALiveUserInFile(file_id, username);
                io.to(project_id).emit("code-editor:user-joined", { aUser, image });

                socket.on("code-editor:leave-file", async ({ file_id }) => {
                    await removeLiveUser(file_id, username);
                    socket.broadcast
                        .to(project_id)
                        .emit("code-editor:user-left", { file_id, username });
                });
            });

            socket.on("chat:send-message", async ({ message, time }) => {
                await insertChatMessage(project_id, username, message, time);
                io.to(project_id).emit("chat:receive-message", { message, time, image, username, socketId: socket.id });
            });

            socket.on("disconnect", async () => {
                await pool.query(
                    "DELETE FROM project_live_users WHERE project_id = $1 AND username = $2",
                    [project_id, username]
                );
                socket.broadcast
                    .to(project_id)
                    .emit("editor:live-user-left", { username });

                socket.broadcast
                    .to(project_id)
                    .emit("code-editor:remove-all-cursor", { username });

                await removeActiveLiveUser(username);
                socket.broadcast
                    .to(project_id)
                    .emit("code-editor:remove-active-live-user", { username });

            });
        });
    });
}

module.exports = socketHandlers;