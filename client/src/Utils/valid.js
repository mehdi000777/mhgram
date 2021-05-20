const valid = ({ fullname, username, email, password, cf_password }) => {
    const err = {}

    if (!fullname) {
        err.fullname = "Please inter your full name.";
    } else if (fullname.length > 25) {
        err.fullname = "Full name is up to 25 characters long."
    }

    if (!username) {
        err.username = "Please inter your user name.";
    } else if (username.length > 25) {
        err.username = "User name is up to 25 characters long."
    }

    if (!email) {
        err.email = "Please inter your email.";
    }

    if (!password) {
        err.password = "Please inter your password.";
    } else if (password.length < 6) {
        err.password = "Password must be at least 6 characters."
    }

    if (password !== cf_password) {
        err.cf_password = "Confirm password did not match";
    }

    return {
        errMessage: err,
        errLength: Object.keys(err).length
    }
}

export default valid;