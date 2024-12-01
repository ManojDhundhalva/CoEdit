import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach,afterEach,test } from "vitest";
import Navbar from "../../components/Navbar.jsx";
import { BrowserRouter } from "react-router-dom";
import useAPI from '../../hooks/api';
import { toast } from "react-hot-toast";
import "@testing-library/jest-dom";
import userEvent from '@testing-library/user-event'; // for simulating user interactions
// Mocking useAuth and useNavigate
vi.mock("../../context/auth", () => ({
    useAuth: () => ({
      LogOut: vi.fn(), // Mock LogOut method
    }),
  }));
  
  

vi.mock("react-router-dom", () => {
    const originalModule = vi.importActual("react-router-dom");
    return {
      __esModule: true,
      ...originalModule,
      Link: ({ children }) => <a>{children}</a>, // Mock Link component as an anchor tag
      useNavigate: vi.fn(),
    };
  });  

  describe('Navbar() Navbar method', () => {
    // Happy Path Tests
    describe('Happy Path', () => {
        it('should render the Navbar component with all links', () => {
            render(<Navbar />);
            expect(screen.getByRole('button', { name: /project/i })).toBeInTheDocument();
          });
          
  
      it('should open the menu when the account icon is clicked', () => {
        render(<Navbar />);
        const accountIcon = screen.getByLabelText('account of current user');
        fireEvent.click(accountIcon);
        expect(screen.getByText('Profile')).toBeInTheDocument();
        expect(screen.getByText('Logout')).toBeInTheDocument();
      });
  
    });
  
    // Edge Case Tests
    describe('Edge Cases', () => {
      it('should hide the navbar on scroll down and show on scroll up', () => {
        render(<Navbar />);
        const navbar = screen.getByRole('navigation');
        // Simulate scroll down
        window.pageYOffset = 100;
        fireEvent.scroll(window);
        expect(navbar).toHaveStyle('top: -80px');
        // Simulate scroll up
        window.pageYOffset = 0;
        fireEvent.scroll(window);
        expect(navbar).toHaveStyle('top: 0');
      });
    });
  });
  
  // End of unit tests for: Navbar
