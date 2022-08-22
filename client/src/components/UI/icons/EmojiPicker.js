import React from "react";
import Picker from "emoji-picker-react";

const EmojiPicker = props => (
    <div className="emoji-picker">
        <Picker onEmojiClick={e => props.selectEmojiHandler(e)} />
    </div>
);

export default EmojiPicker;
