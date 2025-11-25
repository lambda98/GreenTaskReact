# Testing Guide: GreenTasker Application

This document outlines the manual testing procedures to verify the functionality of the GreenTasker application.

## 1. Authentication Testing
*   **Initial Load:** Open the application. Verify that the "Login" card is displayed and the main Todo list is hidden.
*   **Invalid Password:** Enter a random password (e.g., "12345") and press Enter or click Login. Verify that an error message appears or the app remains locked.
*   **Valid Password:** Enter the correct password: `km@2025SD1`. Click Login. Verify that the main application dashboard is revealed.
*   **Persistence (Optional):** Reload the page. Depending on implementation (Session vs Local), verify if you need to login again (Session is safer for "locking" apps, but Local is often used for convenience. This app uses Session for security).

## 2. Task Management (CRUD)
*   **Create:**
    *   Enter "Buy Groceries" in the title input.
    *   Select a date/time in the due date picker.
    *   Click "Add Task".
    *   **Verify:** The new task appears at the top of the list with the correct title and formatted date.
*   **Read:** Verify the list displays all added tasks.
*   **Update (Toggle):** Click the checkbox or the text of a task.
    *   **Verify:** The text becomes struck-through and the checkbox is checked. The style changes to indicate completion.
*   **Update (Edit):**
    *   Click the "Pencil" icon on a task.
    *   Change the title to "Buy Organic Groceries".
    *   Change the date.
    *   Click "Save".
    *   **Verify:** The task updates immediately.
    *   *Cancel Test:* Enter edit mode, change text, click "Cancel". Verify text reverts to original.
*   **Delete:**
    *   Hover over a task (or look for the Trash icon on mobile).
    *   Click the "Trash" icon.
    *   **Verify:** The task is removed from the list.

## 3. Drag and Drop Interaction
*   **Action:** Click and hold the drag handle (six dots icon) of the first task.
*   **Movement:** Drag it below the second task and release.
*   **Verify:**
    *   The items swap positions smoothly.
    *   The layout does not collapse or shift unexpectedly during the drag (Stability check).
    *   The new order persists if you refresh the page (Persistence check).

## 4. Theme Switching (Dark/Light Mode)
*   **Default:** Verify the app loads in the system preference or default Light mode (Green-50 background).
*   **Switch to Dark:** Click the Moon icon in the top right.
*   **Verify:**
    *   Background changes to a dark gray/green tone.
    *   Text becomes light.
    *   Inputs and cards adjust contrast levels for readability.
*   **Switch to Light:** Click the Sun icon. Verify it returns to the original theme.

## 5. Responsive Design
*   **Mobile:** Open Chrome DevTools (F12) -> Toggle Device Toolbar. Select "iPhone SE" or "Pixel 7".
*   **Verify:**
    *   The card fits within the screen width.
    *   Inputs stack correctly.
    *   Buttons remain accessible.
*   **Desktop:** Resize window to full width. Verify the card remains centered with a maximum width constraint.
