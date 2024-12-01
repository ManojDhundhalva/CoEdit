import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CodeEditor from "../CodeEditor"; // Adjust the import based on your file structure
import "@testing-library/jest-dom";
import useAPI from "../../hooks/api";


beforeAll(() => {
  // Mocking getBoundingClientRect for elements with range API
  global.HTMLElement.prototype.getBoundingClientRect = () => ({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
  });

  // Mock document.createRange() with setStart and setEnd methods
  global.document.createRange = vi.fn(() => ({
    setStart: vi.fn(),
    setEnd: vi.fn(),  // Ensure setEnd is mocked
    getBoundingClientRect: vi.fn(() => ({
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: 0,
      height: 0,
    })),
  }));
});



// Mocking dependencies
vi.mock("../../hooks/api", () => ({
  __esModule: true,
  default: vi.fn(),
}));

describe("CodeEditor Component", () => {
  let mockSocket;
  let mockSetTabs;

  // Mocking getBoundingClientRect globally in the setup


  beforeEach(() => {
    mockSocket = {
      emit: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
    };
    mockSetTabs = vi.fn();
    useAPI.mockReturnValue({ GET: vi.fn() }); // Default mock for API call
  });

  // 1. Render the Component and Verify Props
  it("should render with the correct filename and username", () => {
    render(
      <CodeEditor
        fileName="example.js"
        socket={mockSocket}
        fileId="file123"
        username="testUser"
        setTabs={mockSetTabs}
        localImage="local-image-url"
      />
    );

    expect(screen.getByText("example.js")).toBeInTheDocument();
    //expect(screen.getByText("testUser")).toBeInTheDocument();
  });

   it("should close the theme dropdown after a theme is selected", async () => {
    render(
      <CodeEditor
        fileName="test.js"
        socket={mockSocket}
        fileId="file123"
        username="user1"
        setTabs={mockSetTabs}
        localImage="local-image-url"
      />
    );

    const themeDropdown = screen.getByText("monokai");
    fireEvent.click(themeDropdown);

    const newTheme = "lucario";  // Example theme
    const newThemeElement = screen.getByText(newTheme);
    fireEvent.click(newThemeElement);

    await waitFor(() => {
      expect(screen.queryByText("Select Themes")).not.toBeInTheDocument();
    });
  });



  // 2. Verify Default Theme
  it("should display the default theme", () => {
    render(
      <CodeEditor
        fileName="example.js"
        socket={mockSocket}
        fileId="file123"
        username="testUser"
        setTabs={mockSetTabs}
        localImage="local-image-url"
      />
    );

    expect(screen.getByText("monokai")).toBeInTheDocument();
  });

  // 6. Verify Socket Events
  it("should register socket events on mount", () => {
    const mockSocket = {
      emit: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
    };

    render(
      <CodeEditor
        fileName="example.js"
        socket={mockSocket}
        fileId="file123"
        username="testUser"
        setTabs={mockSetTabs}
        localImage="local-image-url"
      />
    );

    expect(mockSocket.on).toHaveBeenCalledTimes(8); // Example: "change" and "save" events
  });

  // 7. Test Theme Dropdown Interaction (Optional)
  it("should open and close the theme dropdown", async () => {
    render(
      <CodeEditor
        fileName="example.js"
        socket={mockSocket}
        fileId="file123"
        username="testUser"
        setTabs={mockSetTabs}
        localImage="local-image-url"
      />
    );

    const themeDropdown = screen.getByText("monokai");
    fireEvent.click(themeDropdown);

    await waitFor(() => {
      expect(screen.getByText("Select Themes")).toBeInTheDocument();
    });

    fireEvent.click(themeDropdown);
    await waitFor(() => {
      expect(screen.queryByText("Select Themes")).not.toBeInTheDocument();
    });
  });

  // 8. Test Theme Change
  it("should change the theme when a new theme is selected", async () => {
    render(
      <CodeEditor
        fileName="example.js"
        socket={mockSocket}
        fileId="file123"
        username="testUser"
        setTabs={mockSetTabs}
        localImage="local-image-url"
      />
    );

    const themeDropdown = screen.getByText("monokai");
    fireEvent.click(themeDropdown);

    const newTheme = "lucario"; // Example theme name
    const newThemeElement = screen.getByText(newTheme);
    fireEvent.click(newThemeElement);

    await waitFor(() => {
      expect(screen.getByText(`${newTheme}`)).toBeInTheDocument();
    });
  });
});
