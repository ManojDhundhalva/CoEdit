import avatar1 from "../images/avatars/avatar1.png";
import avatar2 from "../images/avatars/avatar2.png";
import avatar3 from "../images/avatars/avatar3.png";
import avatar4 from "../images/avatars/avatar4.png";
import avatar5 from "../images/avatars/avatar5.png";

export const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5];

export const getAvatar = (image) => typeof image === 'string' && image.startsWith('http') ? image : avatars[image];