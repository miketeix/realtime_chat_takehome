import React from 'react';
import {cleanup, getDefaultNormalizer, render, screen} from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { Message, MessageDirection, MessageStatus } from '../../../../src/client/types';
import MessageBubble from '../../../../src/client/components/MessageBubble';

// Helper to format time the same way the component does
const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

describe('MessageBubble Component', () => {
    const mockIncomingMessage: Message = {
        id: '1',
        text: 'Hello there!',
        to: ['Hildeby'],
        from: 'John',
        direction: MessageDirection.Incoming,
        createdAt: '2023-05-15T14:30:00.000Z',
        status: MessageStatus.DELIVERED
      };
    
      const mockOutgoingMessage: Message = {
        id: '2',
        text: 'Hi, how are you?',
        to: ['John'],
        from: 'Me',
        direction: MessageDirection.Outgoing,
        createdAt: '2023-05-15T14:31:00.000Z',
        status: MessageStatus.SENT
      };

      const mockFailedMessage: Message = {
        id: '3',
        text: 'Message that failed to send',
        to: ['John'],
        from: 'Me',
        direction: MessageDirection.Outgoing,
        createdAt: '2023-05-15T14:32:00.000Z',
        status: MessageStatus.FAILED
      };
    
      const mockMultilineMessage: Message = {
        id: '4',
        text: 'This is a\nmultiline\nmessage',
        to: ['Me'],
        from: 'John',
        direction: MessageDirection.Incoming,
        createdAt: '2023-05-15T14:33:00.000Z',
        status: MessageStatus.DELIVERED
      };
    afterEach(() => {
      cleanup();
    });
    describe('Rendering', () => {
        it('should render incoming message correctly', () => {
          render(<MessageBubble message={mockIncomingMessage} />);
          
          // Check message text
          expect(screen.getByText(mockIncomingMessage.text)).toBeInTheDocument();
          
          // Check sender name
          expect(screen.getByText(mockIncomingMessage.from)).toBeInTheDocument();
          
          // Check timestamp
          expect(screen.getByText(formatTime(mockIncomingMessage.createdAt))).toBeInTheDocument();
          
          // Check avatar
          const avatar = screen.getByAltText(mockIncomingMessage.from);
          expect(avatar).toBeInTheDocument();
          expect(avatar).toHaveAttribute('src', 'src/client/assets/generic-avatar.svg');
        });
    
        it('should render outgoing message correctly', () => {
          render(<MessageBubble message={mockOutgoingMessage} />);
          
          // Check message text
          expect(screen.getByText(mockOutgoingMessage.text)).toBeInTheDocument();
          
          // Check "You" text for outgoing messages
          expect(screen.getByText("You")).toBeInTheDocument();
          
          // Check timestamp
          expect(screen.getByText(formatTime(mockOutgoingMessage.createdAt))).toBeInTheDocument();
          
          // Check avatar
          const avatar = screen.getByAltText("You");
          expect(avatar).toBeInTheDocument();
        });
    
        it('should render multiline messages correctly', () => {
          render(<MessageBubble message={mockMultilineMessage} />);
          
          // Check that the message text is rendered with whitespace preserved
          const messageElement = screen.getByText(mockMultilineMessage.text, { normalizer: str =>
            getDefaultNormalizer({collapseWhitespace: false})(str) });
          expect(messageElement).toBeInTheDocument();
          expect(messageElement.classList.contains('whitespace-pre-wrap')).toBe(true);
        });
      });

      describe('Message Status', () => {
        it('should show a delivered status icon for delivered messages', () => {
          const { container } = render(<MessageBubble message={mockIncomingMessage} />);
          
          // Check for the checkmark SVG
          const statusSvg = container.querySelector('svg.double-check');
          expect(statusSvg).toBeInTheDocument();
          
          // Check if it has the green color class
          const statusSpan = statusSvg?.parentElement;
          expect(statusSpan).toHaveClass('text-green-500');
        });
    
        it('should show a sent status icon for sent messages', () => {
          const { container } = render(<MessageBubble message={mockOutgoingMessage} />);
          
          // Check for the checkmark SVG
          const statusSvg = container.querySelector('svg.double-check');
          expect(statusSvg).toBeInTheDocument();
          
          // Check if it has the gray color class
          const statusSpan = statusSvg?.parentElement;
          expect(statusSpan).toHaveClass('text-gray-500');
        });
    
        it('should show an error icon for failed messages', () => {
          const { container } = render(<MessageBubble message={mockFailedMessage} />);
          
          // Check for the error SVG
          const errorSvg = container.querySelector('svg.exclamation');
          expect(errorSvg).toBeInTheDocument();
          
          // Check if parent span has the red color class
          const errorSpan = errorSvg?.parentElement;
          expect(errorSpan).toHaveClass('text-red-200');
        });
      });

      describe('Styling', () => {
        it('should apply correct styling for incoming messages', () => {
          const { container } = render(<MessageBubble message={mockIncomingMessage} />);
          
          // Get the message bubble element
          const messageBubble = container.querySelector('.bg-gray-200.text-gray-800');
          expect(messageBubble).toBeInTheDocument();
          expect(messageBubble).toHaveClass('rounded-bl-md');
          
          // Check the container alignment
          const messageContainer = container.firstChild;
          expect(messageContainer).not.toHaveClass('justify-end');
        });
    
        it('should apply correct styling for outgoing messages', () => {
          const { container } = render(<MessageBubble message={mockOutgoingMessage} />);
          
          // Get the message bubble element
          const messageBubble = container.querySelector('.bg-blue-600.text-white');
          expect(messageBubble).toBeInTheDocument();
          expect(messageBubble).toHaveClass('rounded-br-md');
          
          // Check the container alignment
          const messageContainer = container.firstChild;
          expect(messageContainer).toHaveClass('justify-end');
        });
    
        it('should position avatar correctly for incoming messages', () => {
          const { container } = render(<MessageBubble message={mockIncomingMessage} />);
          
          // Check avatar container order
          const avatarContainer = container.querySelector('.flex-shrink-0');
          expect(avatarContainer).toHaveClass('order-1');
        });
    
        it('should position avatar correctly for outgoing messages', () => {
          const { container } = render(<MessageBubble message={mockOutgoingMessage} />);
          
          // Check avatar container order
          const avatarContainer = container.querySelector('.flex-shrink-0');
          expect(avatarContainer).toHaveClass('order-2');
        });
    
        it('should align sender name properly for incoming messages', () => {
          const { container } = render(<MessageBubble message={mockIncomingMessage} />);
          
          // Check text alignment for sender name
          const senderElement = screen.getByText(mockIncomingMessage.from);
          const senderContainer = senderElement.parentElement;
          expect(senderContainer).not.toHaveClass('text-end');
        });
    
        it('should align sender name properly for outgoing messages', () => {
          const { container } = render(<MessageBubble message={mockOutgoingMessage} />);
          
          // Check text alignment for sender name
          const senderElement = screen.getByText('You');
          expect(senderElement).toHaveClass('text-end');
        });
      });
      describe('Time Formatting', () => {
        it('should format time correctly', () => {
          render(<MessageBubble message={mockIncomingMessage} />);
          
          const expectedTime = formatTime(mockIncomingMessage.createdAt);
          expect(screen.getByText(expectedTime)).toBeInTheDocument();
        });
    
        it('should handle different time formats', () => {
          // Create a message with a specific time
          const timeMessage = {
            ...mockIncomingMessage,
            createdAt: '2023-05-15T23:59:00.000Z'
          };
          
          render(<MessageBubble message={timeMessage} />);
          
          const expectedTime = formatTime(timeMessage.createdAt);
          expect(screen.getByText(expectedTime)).toBeInTheDocument();
        });
      });
})