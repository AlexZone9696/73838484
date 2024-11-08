const TonWeb = require("tonweb");
const nacl = require("tweetnacl");

module.exports = async (req, res) => {
    try {
        // Проверка типа запроса
        if (req.method !== 'GET') {
            return res.status(405).json({ error: "Method Not Allowed" });
        }

        // Генерация ключевой пары
        const keyPair = nacl.sign.keyPair();
        const publicKey = keyPair.publicKey;
        const privateKey = keyPair.secretKey;

        // Настройка TonWeb
        const tonweb = new TonWeb();
        const WalletClass = TonWeb.wallet.all.v3R2;
        
        // Создание кошелька
        const wallet = new WalletClass(tonweb.provider, {
            publicKey: publicKey,
            wc: 0
        });

        // Получение адреса
        const address = await wallet.getAddress();

        // Возвращаем JSON-ответ
        res.status(200).json({
            address: address.toString(true, true, true),
            privateKey: Buffer.from(privateKey).toString('hex')
        });
    } catch (error) {
        res.status(500).json({ error: "Ошибка генерации кошелька", details: error.message });
    }
};
