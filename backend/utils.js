import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
    return jwt.sign({
        _id: user._id
    },
        process.env.JWT_SECRET || 'somethingsecretgenerate',
        {
            expiresIn: "1d"
        }
    )
}

export const generateRefreshToken = (user) => {
    return jwt.sign({
        _id: user._id
    },
        process.env.JWT_SECRET_REFRESH || 'somethingsecretrefresh',
        {
            expiresIn: "30d"
        }
    )
}

export class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    paginating() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 9;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}