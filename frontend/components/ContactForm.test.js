import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

test('renders without errors', () => {
    render(<ContactForm />);
});

test('renders the contact form header', () => {
    render(<ContactForm />);
    const header = screen.queryByText(/contact form/i);
    expect(header).toBeInTheDocument();
    expect(header).toBeTruthy;
    expect(header).toHaveTextContent(/contact form/i);
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm />);

    const firstNameInput = screen.getByLabelText(/First Name*/i);
    userEvent.type(firstNameInput, "123");

    const error = await screen.findAllByTestId('error');
    expect(error).toHaveLength(1);
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render (<ContactForm />);

    const submit = screen.getByRole("button")
    userEvent.click(submit);

    const error = await screen.findAllByTestId('error');
    expect(error).toHaveLength(3);
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm />);

    const firstNameInput = screen.getByLabelText(/First Name*/i);
    const lastNameInput = screen.getByLabelText(/Last Name*/i);
    const submit = screen.getByRole("button");

    userEvent.type(firstNameInput, "Irving");
    userEvent.type(lastNameInput, "Delgado");
    userEvent.click(submit);

    const error = await screen.findAllByTestId('error');
    expect(error).toHaveLength(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm />);

    const emailInput = screen.getByLabelText(/Email*/i);
    userEvent.type(emailInput, "Irving.com");

    const error = await screen.findByText(/email must be a valid email address/i);
    expect(error).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />);

    const submit = screen.getByRole("button");
    userEvent.click(submit);

    const error = await screen.findByText(/lastName is a required field/i)
    expect(error).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm />);

    const firstNameInput = screen.getByLabelText(/First Name*/i);
    const lastNameInput = screen.getByLabelText(/Last Name*/i);
    const emailInput = screen.getByLabelText(/Email*/i);
    const submit = screen.getByRole("button");
    
    userEvent.type(firstNameInput, "Irving");
    userEvent.type(lastNameInput, "Delgado");
    userEvent.type(emailInput, "Irving@gmail.com");
    userEvent.click(submit);

    await waitFor(() => {
        const firstNameDisplay = screen.queryByText("Irving");
        const lastNameDisplay = screen.queryByText("Delgado");
        const emailDisplay = screen.queryByText("Irving@gmail.com");
        const messageDisplay= screen.queryByTestId("messageDisplay");

        expect(firstNameDisplay).toBeInTheDocument();
        expect(lastNameDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();
        expect(messageDisplay).not.toBeInTheDocument();
    });
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm />);

    const firstNameInput = screen.getByLabelText(/First Name*/i);
    const lastNameInput = screen.getByLabelText(/Last Name*/i);
    const emailInput = screen.getByLabelText(/Email*/i);
    const messageInput = screen.getByLabelText(/Message/i);
    const submit = screen.getByRole("button");
    
    userEvent.type(firstNameInput, "Irving");
    userEvent.type(lastNameInput, "Delgado");
    userEvent.type(emailInput, "Irving@gmail.com");
    userEvent.type(messageInput, "This is a message")
    userEvent.click(submit);

    await waitFor(() => {
        const firstNameDisplay = screen.queryByText("Irving");
        const lastNameDisplay = screen.queryByText("Delgado");
        const emailDisplay = screen.queryByText("Irving@gmail.com");
        const messageDisplay= screen.queryByText("This is a message");

        expect(firstNameDisplay).toBeInTheDocument();
        expect(lastNameDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();
        expect(messageDisplay).toBeInTheDocument();
    });
});
