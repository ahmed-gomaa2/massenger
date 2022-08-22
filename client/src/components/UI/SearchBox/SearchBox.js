import React, {useState} from 'react';
import './SearchBox.css';

const SearchBox = (props) => {
    const [showGoBack, setShowGoBack] = useState(false);

    return (
        <form onSubmit={e => e.preventDefault()} className={'SearchBox'}>
            {/*{showGoBack && <p className={'SearchBox__goBack'}><i className="fa-solid SearchBox__goBack--icon fa-arrow-left"></i></p>}*/}
            <input
                style={{paddingLeft: `${showGoBack ? '35px': '15px'}`}}
                // onBlur={e=> setShowGoBack(false)}
                onFocus={e => {
                props.startSearching();
                // setShowGoBack(true);
            }} value={props.value} onChange={props.inputChangeHandler} className={'SearchBox__input'} placeholder={'Search For Friends'} type={"text"} />
            <button className={'SearchBox__button'}>
                <i className="fa-solid SearchBox__magnifier fa-magnifying-glass"></i>
            </button>
        </form>
    );
};

export default SearchBox;