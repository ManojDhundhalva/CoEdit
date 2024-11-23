// Import necessary libraries and components
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';  // Use vi from vitest
import Pill from '../../components/Pill'; // Import the Pill component

describe('Pill Component', () => {
  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should render the Pill component with image and text', () => {
      // Test to ensure the component renders correctly with given props
      const image = 'test-image.png';
      const text = 'Test Pill';
      render(<Pill image={image} text={text} onClick={() => {}} />);

      const imgElement = screen.getByRole('img', { name: text });
      const textElement = screen.getByText(/Test Pill/i);

      expect(imgElement).toHaveAttribute('src', image);
      expect(textElement).toBeInTheDocument();
    });

    it('should call onClick handler when the Pill is clicked', () => {
      // Test to ensure the onClick handler is called when the Pill is clicked
      const handleClick = vi.fn(); // Use vi.fn() in Vitest
      render(<Pill image="test-image.png" text="Test Pill" onClick={handleClick} />);

      const pillElement = screen.getByText(/Test Pill/i);
      fireEvent.click(pillElement);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should render without crashing when image is not provided', () => {
      // Test to ensure the component renders even if the image prop is missing
      const text = 'Test Pill';
      render(<Pill text={text} onClick={() => {}} />);

      const textElement = screen.getByText(/Test Pill/i);
      expect(textElement).toBeInTheDocument();
    });

    it('should render without crashing when text is not provided', () => {
      // Test to ensure the component renders even if the text prop is missing
      const image = 'test-image.png';
      render(<Pill image={image} onClick={() => {}} />);

      const imgElement = screen.getByRole('img');
      expect(imgElement).toHaveAttribute('src', image);
    });

    it('should handle null onClick gracefully', () => {
      // Test to ensure the component does not crash if onClick is null
      const image = 'test-image.png';
      const text = 'Test Pill';
      render(<Pill image={image} text={text} onClick={null} />);

      const pillElement = screen.getByText(/Test Pill/i);
      fireEvent.click(pillElement);

      // No assertion for onClick as it is null, just ensuring no crash
    });
  });
});
