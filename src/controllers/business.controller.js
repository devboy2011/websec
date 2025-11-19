exports.getBusiness = async (req, res) => {
    try {
        return res.status(200).json({
            message: 'Business endpoint is working',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal error' });
    }
}

exports.doBusiness = async (req, res) => {
    try {
        return res.status(200).json({
            message: 'Business endpoint is working',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal error' });
    }
}