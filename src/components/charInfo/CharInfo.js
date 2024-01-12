import './charInfo.scss';
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import useMarvelService from '../../services/MarvelService';
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import setContent from '../../utils/setContent';

const CharInfo = ({ charId }) => {
    const [char, setChar] = useState(null);
    const nodeRef = useRef(null);

    const { process, setProcess, getCharacter, clearError } = useMarvelService();

    useEffect(() => {
        updateChar();
        // eslint-disable-next-line
    }, [charId])

    const updateChar = () => {
        if (!charId) {
            return;
        }
        clearError()
        getCharacter(charId)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'))
    }

    const onCharLoaded = (char) => {
        setChar(char);
    }

    return (
        <div className="char__info">
            <CSSTransition
                in={process === 'confirmed'}
                nodeRef={nodeRef}
                timeout={500}
                classNames="char">
                <div ref={nodeRef} >
                    {setContent(process, View, char)}
                </div>
            </CSSTransition>
        </div>
    )
}

const View = ({ data }) => {
    const { name, description, thumbnail, homepage, wiki, comics } = data;

    let imgStyle = { 'objectFit': 'cover' };
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = { 'objectFit': 'unset' };
    }

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle} />
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? null : 'There is no comics with this character'}
                {comics
                    .slice(0, 10)
                    .map((item, i) => {
                        return (
                            <li key={i} className="char__comics-item">
                                <Link to={item.link}>{item.name}</Link>
                            </li>
                        )
                    })}
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;