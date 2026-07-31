// ========================================================================
// CONTROLADOR PRINCIPAL DE LA API
// ========================================================================

const mainApiController = {
    // Método 'index' para responder a la raíz /api
    index: (req, res) => {
        return res.status(200).json({
            meta: {
                status: 200,
                success: true,
                message: "Servidor API Negratone activo"
            },
            data: {
                version: "1.0.0",
                endpoints: [
                    "/api/products",
                    "/api/categories",
                    "/api/stats"
                ]
            }
        });
    }
};

module.exports = mainApiController;
