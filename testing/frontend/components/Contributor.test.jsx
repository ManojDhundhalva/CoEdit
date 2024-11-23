import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach,afterEach,test } from "vitest";
import Contributor from "../../components/Contributor";
import { BrowserRouter } from "react-router-dom";
import useAPI from '../../hooks/api';
import { toast } from "react-hot-toast";
import "@testing-library/jest-dom";
import userEvent from '@testing-library/user-event'; // for simulating user interactions


// Mocking the useAPI hook
vi.mock("../../hooks/api", () => {
  const originalModule = vi.importActual("../../hooks/api");
  return {
    __esModule: true,
    ...originalModule,
    default: vi.fn(),
  };
});

// Mocking the toast function
vi.mock("react-hot-toast", () => {
  const originalModule = vi.importActual("react-hot-toast");
  return {
    __esModule: true,
    ...originalModule,
    toast: {
      success: vi.fn(),
    },
  };
});

describe('Contributor() Contributor method', () => {
  let GET, POST;

  beforeEach(() => {
    GET = vi.fn();
    POST = vi.fn();
    useAPI.mockReturnValue({ GET, POST });
  });

  describe('Happy Path', () => {
    it('should render the component correctly', () => {
      // Render the Contributor component
      render(<Contributor projectId="123" handleClose={vi.fn()} />);
    
      // Check if the title is rendered
      expect(screen.getByText('Add Contributors')).toBeInTheDocument();
    
      // Ensure the contributor textbox is present
      expect(screen.getByRole('textbox', { name: /contributors/i })).toBeInTheDocument();
    
      // Ensure the Add button is present
      expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
    });
    

    it('should fetch and display user suggestions based on search term', async () => {
      // Mock GET response
      GET.mockResolvedValueOnce({
        data: [
          { id: 1, firstname: 'John', lastname: 'Doe', emailid: 'john@example.com' },
        ],
      });

      // Render the Contributor component
      render(<Contributor projectId="123" handleClose={vi.fn()} />);

      // Simulate user typing in the search field
      fireEvent.change(screen.getByLabelText('Contributors'), { target: { value: 'John' } });

      // Wait for suggestions to appear
      await waitFor(() => expect(GET).toHaveBeenCalledWith('/project/users/search', { q: 'John', projectId: '123' }));
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should add a user to the selected list when clicked', async () => {
      // Mock GET response
      GET.mockResolvedValueOnce({
        data: [
          { id: 1, firstname: 'John', lastname: 'Doe', emailid: 'john@example.com' },
        ],
      });
    
      // Render the Contributor component
      render(<Contributor projectId="123" handleClose={vi.fn()} />);
    
      // Simulate user typing in the search field
      fireEvent.change(screen.getByLabelText('Contributors'), { target: { value: 'John' } });
    
      // Wait for suggestions to appear
      await waitFor(() => expect(screen.getByText('John Doe')).toBeInTheDocument());
    
      // Click on the suggestion after it appears
      fireEvent.click(screen.getByText('John Doe'));
    
      // Check if the user is added to the selected list
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });    
  });

  describe('Edge Cases', () => {
    
    // it('should not allow selecting the same user twice', async () => {
    //   // Mock GET response with user suggestion
    //   GET.mockResolvedValueOnce({
    //     data: [
    //       { id: 1, firstname: 'John', lastname: 'Doe', emailid: 'john@example.com' },
    //     ],
    //   });
    
    //   // Render the Contributor component
    //   render(<Contributor projectId="123" handleClose={vi.fn()} />);
      
    //   // Simulate typing 'John' in the search field
    //   fireEvent.change(screen.getByLabelText('Contributors'), { target: { value: 'John' } });
    //   await waitFor(() => screen.getByText('John Doe'));  // Wait for the suggestion
    
    //   // Click on the suggestion to select John Doe
    //   fireEvent.click(screen.getByText('John Doe'));
    
    //   // Ensure John Doe is added to the selected list (in a chip component)
    //   expect(screen.getByText('John Doe')).toBeInTheDocument();
    
    //   // Simulate typing 'John' again to search for the same user
    //   fireEvent.change(screen.getByLabelText('Contributors'), { target: { value: 'John' } });
    //   await waitFor(() => screen.queryByText('John Doe'));
    
    //   // Ensure John Doe is not shown in the suggestion list anymore
    //   // Check that 'John Doe' does not appear in the suggestion list
    //   expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    
    //   // Ensure John Doe is still in the selected list (as a chip)
    //   expect(screen.getByText('John Doe')).toBeInTheDocument(); // This ensures the user is in the selected list (as a chip)
    // });
    
    
    
    it('should handle empty search term gracefully', async () => {
      // Render the Contributor component
      render(<Contributor projectId="123" handleClose={vi.fn()} />);

      // Simulate user typing in the search field
      fireEvent.change(screen.getByLabelText('Contributors'), { target: { value: '' } });

      // Check if no suggestions are fetched
      expect(GET).not.toHaveBeenCalled();
    });

    it('should handle API errors gracefully', async () => {
      // Mock GET error
      GET.mockRejectedValueOnce(new Error('API Error'));

      // Render the Contributor component
      render(<Contributor projectId="123" handleClose={vi.fn()} />);

      // Simulate user typing in the search field
      fireEvent.change(screen.getByLabelText('Contributors'), { target: { value: 'John' } });

      // Wait for the error handling
      await waitFor(() => expect(GET).toHaveBeenCalledWith('/project/users/search', { q: 'John', projectId: '123' }));

      // Check if no suggestions are displayed
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });

    it('should not submit if no users are selected', () => {
      // Render the Contributor component
      render(<Contributor projectId="123" handleClose={vi.fn()} />);

      // Submit the form without selecting users
      fireEvent.click(screen.getByText('Add'));

      // Check if the error message is displayed
      expect(screen.getByText('Please select atleast a user.')).toBeInTheDocument();
    });
  });
  
  
});

describe('Contributor Component', () => {
  it('should close the component when the close button is clicked', () => {
    // Mock handleClose function
    const handleClose = vi.fn();

    // Render the Contributor component with the handleClose function
    render(<Contributor projectId="123" handleClose={handleClose} />);

    // Find the close button by its icon or other accessible element
    const closeButton = screen.getByTestId('CloseRoundedIcon'); // You may need to set this id if it is not present

    // Simulate a click on the close button
    fireEvent.click(closeButton);

    // Assert that handleClose was called
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
