import './charList.scss';
import { createRef, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import useMarvelService from '../../services/MarvelService';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Spinner from '../spinner/Spinner';
import { ErrorMessage } from 'formik';

const setContent = (process, Component, newItemLoading) => {
    switch (process) {
        case 'waiting':
            return <Spinner />
        case 'loading':
            return newItemLoading ? <Component /> : <Spinner />
        case 'confirmed':
            return <Component />
        case 'error':
            return <ErrorMessage />
        default:
            throw new Error('Unexpected process state')
    }
}

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);
    const effectCalled = useRef(false);

    const { getAllCharacters, process, setProcess } = useMarvelService();

    useEffect(() => {
        if (effectCalled.current) return;
        onRequest(offset, true);
        effectCalled.current = true;
        // eslint-disable-next-line
    }, [])

    const onRequest = (offset, initial) => {
        setNewItemLoading(initial ? false : true)
        getAllCharacters(offset)
            .then(onCharListLoaded)
            .then(() => setProcess('confirmed'))
    }

    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharList]);
        setNewItemLoading(false);
        setOffset(offset => offset + 9);
        setCharEnded(ended);
    }

    const itemRefs = [];

    const addRef = (i, nodeRef) => {
        itemRefs[i] = nodeRef
    }

    const focusOnItem = (i) => {
        itemRefs.forEach(item => item.current.classList.remove('char__item_selected'));
        itemRefs[i].current.classList.add('char__item_selected');
        itemRefs[i].current.focus();
    }

    function renderItems(arr) {
        const items = arr.map((item, i) => {
            let imgStyle = { 'objectFit': 'cover' };
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = { 'objectFit': 'unset' };
            }
            const nodeRef = createRef();
            addRef(i, nodeRef)
            return (
                <CSSTransition nodeRef={nodeRef} key={item.id} timeout={500} classNames="char__item">
                    <li
                        className="char__item"
                        tabIndex={0}
                        ref={nodeRef}
                        onClick={() => {
                            props.onCharSelected(item.id);
                            focusOnItem(i);
                        }}
                        onKeyUp={(e) => {
                            if (e.key === ' ' || e.key === "Enter") {
                                props.onCharSelected(item.id);
                                focusOnItem(i);
                            }
                        }}>
                        <img src={item.thumbnail} alt={item.name} style={imgStyle} />
                        <div className="char__name">{item.name}</div>
                    </li>
                </CSSTransition>
            )
        });
        return (
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {items}
                </TransitionGroup>
            </ul>
        )
    }

    const elements = useMemo(() => {
        return setContent(process, () => renderItems(charList), newItemLoading)
        // eslint-disable-next-line
    }, [process])
    return (
        <div className="char__list">
            {elements}
            <button
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{ display: charEnded ? 'none' : 'block' }}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;