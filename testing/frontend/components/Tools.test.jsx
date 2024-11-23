import { fireEvent, render, screen ,waitFor} from '@testing-library/react';
import { UserProvider } from '/Users/manalithakkar/Desktop/Real-time-collaborative-editor5/frontend/src/context/user';
import { useNavigate, useParams } from 'react-router-dom';
import useAPI from '../../hooks/api';
import Tools from '../../components/Tools';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mocking useAPI hook
vi.mock('../../hooks/api', () => {
    const originalModule = vi.importActual('../../hooks/api');
    return {
      __esModule: true,
      ...originalModule,
      default: () => ({
        GET: vi.fn(),
      }),
    };
  });
  
  // Mocking react-router-dom hooks
  vi.mock('react-router-dom', () => {
    const originalModule = vi.importActual('react-router-dom');
    return {
      __esModule: true,
      ...originalModule,
      useNavigate: vi.fn(),
      useParams: vi.fn(() => ({ projectId: '123' })), // Directly mock return value
    };
  });
  
  describe('Tools() Tools method', () => {
    let mockNavigate;
    let mockGet;
  
    beforeEach(() => {
      mockNavigate = useNavigate();
      mockGet = useAPI().GET;
    });
  
    describe('Happy Path', () => {
          
  
      it('should open and close the contributor dialog', () => {
        render(<Tools liveUsers={[]} />);
      
        // Open dialog
        fireEvent.click(screen.getByLabelText('Add Contributors'));
        expect(screen.getByText('Add Contributors')).toBeInTheDocument();
      
        // Close dialog
        fireEvent.click(screen.getByTestId('CloseRoundedIcon'));
        expect(screen.queryByText('Add Contributors')).not.toBeInTheDocument();
      });
      
  
    
    });
  
    describe('Edge Cases', () => {
        beforeEach(() => {
            // Mock console.log
            vi.spyOn(console, 'log').mockImplementation(() => {});
          });
        
          afterEach(() => {
            // Restore console.log after each test
            console.log.mockRestore();
          });
        
          it('should handle API error gracefully', async () => {
            // Mock API error
            mockGet.mockRejectedValueOnce(new Error('API Error'));
        
            render(<Tools liveUsers={[]} />);
        
            // Wait for the error to be logged
            await waitFor(() => {
              expect(console.log).toHaveBeenCalledWith('err ->', expect.any(Error));
            });
          });
  
      it('should handle empty liveUsers array', () => {
        render(<Tools liveUsers={[]} />);
  
        // Check if no avatars are rendered
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
      });
  
      it('should handle liveUsers with multiple users', () => {
        const liveUsers = [
          { username: 'user1' },
          { username: 'user2' },
        ];
  
        render(<Tools liveUsers={liveUsers} />);
  
        // Check if avatars are rendered
        expect(screen.getAllByRole('img')).toHaveLength(2);
      });
    });
  });