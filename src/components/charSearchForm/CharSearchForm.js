import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charSearchForm.scss';

const setContent = (process, Form, Component, data) => {
    switch (process) {
        case 'waiting':
            return <Form loading={false} />
        case 'loading':
            return <Form loading={true} />
        case 'confirmed':
            return <><Form loading={false} /><Component data={data} /></>
        case 'error':
            return <div className="char__search-critical-error"><ErrorMessage /></div>
        default:
            throw new Error('Unexpected process state')
    }
}

const CharSearchForm = () => {
    const [char, setChar] = useState(null);
    const { getCharacterByName, clearError, process, setProcess } = useMarvelService();

    const updateChar = (name) => {
        clearError();

        getCharacterByName(name)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'));
    }

    const onCharLoaded = (char) => {
        setChar(char);
    }

    const renderForm = (loading) => {
        return (
            <Formik
                initialValues={{
                    charName: ''
                }}
                validationSchema={Yup.object({
                    charName: Yup.string().required('This field is required')
                })}
                onSubmit={({ charName }) => {
                    updateChar(charName);
                }}
            >
                <Form>
                    <label className="char__search-label" htmlFor="charName">Or find a character by name:</label>
                    <div className="char__search-wrapper">
                        <Field
                            id="charName"
                            name='charName'
                            type='text'
                            placeholder="Enter name" />
                        <button
                            type='submit'
                            className="button button__main"
                            disabled={loading}>
                            <div className="inner">find</div>
                        </button>
                    </div>
                    <FormikErrorMessage component="div" className="char__search-error" name="charName" />
                </Form>
            </Formik>
        )
    }

    return (
        <div className="char__search-form">
            {setContent(process, ({ loading }) => renderForm(loading), View, char)}
        </div>
    )
}

const View = ({ data }) => {
    return (
        data.length > 0 ?
            <div className="char__search-wrapper">
                <div className="char__search-success">There is! Visit {data[0].name} page?</div>
                <Link to={`/characters/${data[0].id}`} className="button button__secondary">
                    <div className="inner">To page</div>
                </Link>
            </div> :
            <div className="char__search-error">
                The character was not found. Check the name and try again
            </div>
    )
}

export default CharSearchForm;