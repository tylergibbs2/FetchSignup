import { useEffect, useState } from 'react'

import { Card } from 'react-bootstrap';

import './App.css';
import { FORM_USER_OPTIONS_URL } from './constants';
import { IUserOptionState } from './interfaces';
import { FormComponent } from './components/Form';

export const App = () => {
  const [occupations, setOccupations] = useState<string[]>([]);
  const [states, setStates] = useState<IUserOptionState[]>([]);

  // Fetch the possible options for the user form (occupations and states) on mount
  useEffect(() => {
    if (occupations.length !== 0 && states.length !== 0) {
      // they were already fetched, so this effect doesn't need to run
      return;
    }

    fetchUserOptions();
  }, []);

  /**
   * Fetches the possible options for the user form from the API (occupations and states)
   * @returns {Promise<void>}
   */
  const fetchUserOptions = async (): Promise<void> => {
    const response = await fetch(FORM_USER_OPTIONS_URL);
    if (response.status != 200) {
      return;
    }

    const { occupations, states } = await response.json();
    setOccupations(occupations);
    setStates(states);
  }

  return (
    <Card id="formCard" className="mt-5">
      <Card.Body>
        <h1 className="text-center">Fetch Signup</h1>

        <p className="text-center text-muted">Please fill out the form below to continue setting up your account.</p>

        <FormComponent occupations={occupations} states={states} />
      </Card.Body>
    </Card>
  )
}
