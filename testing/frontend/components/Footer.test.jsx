// Unit tests for: Footer

import { render, screen } from '@testing-library/react';
import Footer from '../Footer';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

describe('Footer() Footer method', () => {
  // Happy Path Tests
  describe('Happy Path', () => {
    it('should render the footer with correct text and links', () => {
      // Render the Footer component
      render(<Footer />);

      // Check for the presence of the social media text
      expect(screen.getByText(/Get connected with us on social networks:/i)).toBeInTheDocument();

      // Check for the presence of social media icons
      expect(screen.getAllByRole('link')).toHaveLength(5); // 4 social links + 1 TEAM-G35 link

      // Check for the presence of TEAM-G35 text
      //expect(screen.getAllByText(/TEAM-G35/i)).toBeInTheDocument();

      // Check for the presence of contact information
      expect(screen.getByText(/DAIICT, INDIA/i)).toBeInTheDocument();
      expect(screen.getByText(/abc@daiict.ac.in/i)).toBeInTheDocument();
    });

    it('should have correct styles applied', () => {
      // Render the Footer component
      render(<Footer />);

      // Check for the background color of the footer
      const footerElement = screen.getByRole('contentinfo');
      expect(footerElement).toHaveStyle('background-color: #f0fff1');

      // Check for the background color of the bottom section
      // const bottomSection = screen.getAllByText(/TEAM-G35/i).closest('div');
      // expect(bottomSection).toHaveStyle('background-color: #b7e4c7');
    });
  });

  // Edge Case Tests
describe('Edge Cases', () => {
  it('should handle missing social media links gracefully', () => {
    // Mock the MDBIcon component to simulate missing icons
    vi.mock("mdb-react-ui-kit", async () => {
      const actualModule = await vi.importActual("mdb-react-ui-kit"); // Import the full module
      return {
        ...actualModule, // Return all other components as they are
        MDBIcon: () => null, // Mock MDBIcon component
      };
    });

    // Render the Footer component
    render(<Footer />);

    // Check that the social media links are still present even if icons are missing
    expect(screen.getAllByRole('link')).toHaveLength(5); // 4 social links + 1 TEAM-G35 link
  });

  it('should handle missing contact information gracefully', () => {
    // Mock the MDBCol component to simulate missing contact info
    vi.mock("mdb-react-ui-kit", async () => {
      const actualModule = await vi.importActual("mdb-react-ui-kit"); // Import the full module
      return {
        ...actualModule, // Return all other components as they are
        MDBCol: ({ children }) => <div>{children}</div>, // Mock MDBCol component
      };
    });

    // Render the Footer component
    render(<Footer />);

    // Check that the contact section is still rendered
    expect(screen.getByText(/Contact/i)).toBeInTheDocument();
  });
});

});

// End of unit tests for: Footer
