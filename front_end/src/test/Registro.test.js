import { render, screen } from '@testing-library/react';
import { Register } from '../pages/Register';

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

test('renders Register component', () => {
  render(<Register />);
  expect(screen.getByText('NeoCDT')).toBeInTheDocument();
});