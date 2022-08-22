export default (value, rules) => {
    let isValid = true;
    if(!rules) {
        return true;
    }

    if(rules.isEmail) {
        isValid = String(value)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            ) && isValid;
    }

    if(rules?.required) {
        isValid = value.trim() !== '' && isValid;
    }

    if(rules?.minLength) {
        isValid = value.length >= rules.minLength && isValid;
    }

    if(rules?.maxLength) {
        isValid = value.length <= rules.maxLength && isValid;
    }

    return isValid;
}
