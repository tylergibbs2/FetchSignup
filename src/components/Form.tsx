import { useForm, SubmitHandler } from 'react-hook-form';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useState } from 'react';

import { FORM_POST_URL } from '../constants';
import { IUserFormPostResponse, IUserOptionState } from '../interfaces';


interface IFormInput {
    name: string;
    email: string;
    password: string;
    occupation: string;
    state: string;
}

interface IFormComponentProps {
    occupations: string[];
    states: IUserOptionState[];
}


export const FormComponent = ({ occupations, states }: IFormComponentProps) => {
    const [apiError, setApiError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors, isValid, isSubmitted, isSubmitSuccessful } } = useForm<IFormInput>();

    /**
     * Handles the form submission
     * @param formData Object with the input values from the form
     * @throws {Error} There was an issue posting the form data
     * @returns {Promise<void>}
     */
    const onSubmit: SubmitHandler<IFormInput> = async (formData): Promise<void> => {
        const payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        };

        // the api returns a 201 for a successful post
        const response = await fetch(FORM_POST_URL, payload);
        if (response.status != 201) {
            setApiError('There was an issue submitting the form. Please try again.');
            throw new Error("Error submitting form");
        }

        const data: IUserFormPostResponse = await response.json();
        // TODO: do something with the response data! out of scope for this project
        // future ideas include: redirecting to a success page, displaying a success message,
        // or displaying the user's information on the page

        // store the user's information in local storage
        // would certainly be better if it was stored in the session by the server, but this is just a demo
        localStorage.setItem("user", JSON.stringify(data));
    }

    return (
        <Form validated={isValid} onSubmit={handleSubmit(onSubmit)} className="mt-3">
            <Form.Group>
                <Form.Label>Full name</Form.Label>
                <Form.Control {...register("name", { required: true })} type="text" placeholder="Jane Doe" />
                {errors.name && <span className="text-danger">Please enter your name.</span>}
            </Form.Group>

            <Row className="mt-3">
                <Form.Group as={Col} md={6}>
                    <Form.Label>Email</Form.Label>
                    <Form.Control {...register("email", { required: true })} type="email" placeholder="j.doe@fetchrewards.com" />
                    {errors.email && <span className="text-danger">Please enter a valid email.</span>}
                </Form.Group>

                <Form.Group as={Col} md={6}>
                    <Form.Label>Password</Form.Label>
                    <Form.Control {...register("password", { required: true, minLength: 8 })} type="password" placeholder="********" />
                    {errors.password && <span className="text-danger">Password must be at least 8 characters.</span>}
                </Form.Group>
            </Row>

            <Row className="mt-3">
                <Form.Group as={Col} md={6}>
                    <Form.Label>Occupation</Form.Label>
                    <Form.Select {...register("occupation", { required: true })}>
                        <option disabled selected hidden value="">Select an occupation...</option>
                        {occupations.map((occupation, i) => (<option key={i}>{occupation}</option>))}
                    </Form.Select>
                    {errors.occupation && <span className="text-danger">Please select an occupation.</span>}
                </Form.Group>

                <Form.Group as={Col} md={6}>
                    <Form.Label>State</Form.Label>
                    <Form.Select {...register("state", { required: true })}>
                        <option disabled selected hidden value="">Select your state...</option>
                        {states.map((state, i) => (<option key={i}>{state.name} ({state.abbreviation})</option>))}
                    </Form.Select>
                    {errors.state && <span className="text-danger">Please select your state.</span>}
                </Form.Group>
            </Row>

            <Row>
                <Button className="mt-3 w-50 mx-auto" variant="primary" type="submit">
                    Submit
                </Button>
            </Row>

            {isSubmitSuccessful && <span className="text-success mt-3 d-block text-center">Account created successfully!</span>}
            {apiError && <span className="text-danger mt-3 d-block text-center">{apiError}</span>}
        </Form>
    )
}