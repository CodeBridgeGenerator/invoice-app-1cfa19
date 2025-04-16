module.exports = function logErrors() {
    return (context) => {
        const { error, params } = context;

        // console.log("Error Hook Triggered", params);

        if (error) {
            const errorData = {
                serviceName: context.path,
                error: JSON.stringify(error),
                message: error.message,
                stack: 'reactjs',
                details: '',
                createdBy:
                    params &&
                    params.user &&
                    typeof params.user._id !== 'undefined'
                        ? params.user._id
                        : null,
                updatedBy:
                    params &&
                    params.user &&
                    typeof params.user._id !== 'undefined'
                        ? params.user._id
                        : null
            };

            context.app.service('errorLogs').create(errorData);
        }
        return context;
    };
};
