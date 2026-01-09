import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MenuItem, MenuGroup } from '@grafana/ui';

import { WithContextMenu } from './WithContextMenu';

describe('WithContextMenu', () => {
  it('supports mouse events', async () => {
    render(
      <WithContextMenu
        renderMenuItems={() => (
          <>
            <MenuGroup>
              <MenuItem label="Item 1" />
              <MenuItem label="Item 2" />
            </MenuGroup>
          </>
        )}
      >
        {({ openMenu }) => (
          <div data-testid="context-menu-target" onClick={openMenu}>
            Click me
          </div>
        )}
      </WithContextMenu>
    );

    expect(screen.getByTestId('context-menu-target')).toBeInTheDocument();
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Item 2')).not.toBeInTheDocument();

    // Simulate click to open context menu
    await userEvent.click(screen.getByTestId('context-menu-target'));

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  // FIXME: this test isn't correct yet, probably because of how I've done the user-events wrong
  it('supports keyboard events', async () => {
    class DOMRect {
      public get top(): number {
        return this.y;
      }
      public get left(): number {
        return this.x;
      }
      public get bottom(): number {
        return this.y + this.height;
      }
      public get right(): number {
        return this.x + this.width;
      }
      constructor(
        public x = 0,
        public y = 0,
        public width = 0,
        public height = 0
      ) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
      }
      static fromRect(other: DOMRect) {
        return new DOMRect(other.x, other.y, other.width, other.height);
      }
      toJSON() {
        return JSON.stringify(this);
      }
    }

    render(
      <WithContextMenu
        renderMenuItems={() => (
          <>
            <MenuGroup>
              <MenuItem label="Item 1" />
              <MenuItem label="Item 2" />
            </MenuGroup>
          </>
        )}
      >
        {({ openMenu }) => (
          <div
            data-testid="context-menu-target"
            tabIndex={0}
            onKeyDown={(ev) => {
              ev.preventDefault();
              openMenu(ev);
            }}
          >
            Press enter on me
          </div>
        )}
      </WithContextMenu>
    );

    expect(screen.getByTestId('context-menu-target')).toBeInTheDocument();
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Item 2')).not.toBeInTheDocument();

    const target = screen.getByTestId('context-menu-target');

    // Simulate key down to open context menu
    await userEvent.type(target, ' ');

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('supports explicit positioning', async () => {
    render(
      <WithContextMenu
        renderMenuItems={() => (
          <>
            <MenuGroup>
              <MenuItem label="Item 1" />
              <MenuItem label="Item 2" />
            </MenuGroup>
          </>
        )}
      >
        {({ openMenu }) => (
          <div data-testid="context-menu-target" onClick={(ev) => openMenu({ x: ev.pageX, y: ev.pageY })}>
            Click me
          </div>
        )}
      </WithContextMenu>
    );

    expect(screen.getByTestId('context-menu-target')).toBeInTheDocument();
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Item 2')).not.toBeInTheDocument();

    // Simulate key down to open context menu
    await userEvent.click(screen.getByTestId('context-menu-target'));

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('does not open menu when openMenu is called with undefined', async () => {
    render(
      <WithContextMenu
        renderMenuItems={() => (
          <>
            <MenuGroup>
              <MenuItem label="Item 1" />
              <MenuItem label="Item 2" />
            </MenuGroup>
          </>
        )}
      >
        {({ openMenu }) => (
          <div data-testid="context-menu-target" onClick={() => openMenu(undefined)}>
            Click me
          </div>
        )}
      </WithContextMenu>
    );

    expect(screen.getByTestId('context-menu-target')).toBeInTheDocument();
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Item 2')).not.toBeInTheDocument();

    // Simulate click to open context menu
    await userEvent.click(screen.getByTestId('context-menu-target'));

    expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Item 2')).not.toBeInTheDocument();
  });
});
