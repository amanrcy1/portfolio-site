import React from 'react';
import { render, screen } from '@testing-library/react';
import { FadeIn } from './FadeIn';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef(({ children, className, ...props }: any, ref: any) =>
      React.createElement('div', {
        ref,
        className,
        'data-testid': 'motion-div',
        'data-initial': JSON.stringify(props.initial),
        'data-animate': JSON.stringify(props.animate),
        'data-transition': JSON.stringify(props.transition),
        'data-variants': JSON.stringify(props.variants),
      }, children)
    ),
  },
}));

// Mock useReducedMotion
const mockUseReducedMotion = jest.fn(() => false);
jest.mock('./useReducedMotion', () => ({
  useReducedMotion: () => mockUseReducedMotion(),
}));

describe('FadeIn', () => {
  beforeEach(() => {
    mockUseReducedMotion.mockReturnValue(false);
  });

  it('renders children correctly', () => {
    render(<FadeIn><p>Hello World</p></FadeIn>);
    expect(screen.getByText('Hello World')).toBeTruthy();
  });

  it('applies className prop', () => {
    render(<FadeIn className="custom-class"><p>Test</p></FadeIn>);
    const motionDiv = screen.getByTestId('motion-div');
    expect(motionDiv.className).toContain('custom-class');
  });

  it('uses fadeVariants with hidden/visible states', () => {
    render(<FadeIn><p>Test</p></FadeIn>);
    const motionDiv = screen.getByTestId('motion-div');
    const variants = JSON.parse(motionDiv.getAttribute('data-variants') || '{}');
    expect(variants).toEqual({ hidden: { opacity: 0 }, visible: { opacity: 1 } });
  });

  it('sets initial to hidden and animate to visible', () => {
    render(<FadeIn><p>Test</p></FadeIn>);
    const motionDiv = screen.getByTestId('motion-div');
    expect(motionDiv.getAttribute('data-initial')).toBe('"hidden"');
    expect(motionDiv.getAttribute('data-animate')).toBe('"visible"');
  });

  it('applies default duration and delay when not specified', () => {
    render(<FadeIn><p>Test</p></FadeIn>);
    const motionDiv = screen.getByTestId('motion-div');
    const transition = JSON.parse(motionDiv.getAttribute('data-transition') || '{}');
    expect(transition).toEqual({ duration: 0.5, delay: 0 });
  });

  it('applies custom duration and delay', () => {
    render(<FadeIn duration={1.2} delay={0.3}><p>Test</p></FadeIn>);
    const motionDiv = screen.getByTestId('motion-div');
    const transition = JSON.parse(motionDiv.getAttribute('data-transition') || '{}');
    expect(transition).toEqual({ duration: 1.2, delay: 0.3 });
  });

  it('uses reducedMotionTransition when reduced motion is preferred', () => {
    mockUseReducedMotion.mockReturnValue(true);
    render(<FadeIn duration={1.0} delay={0.5}><p>Test</p></FadeIn>);
    const motionDiv = screen.getByTestId('motion-div');
    const transition = JSON.parse(motionDiv.getAttribute('data-transition') || '{}');
    expect(transition).toEqual({ duration: 0.15 });
  });
});
