import crypto from 'crypto';

const vnp_TmnCode = process.env.VNP_TMN_CODE!;
const vnp_HashSecret = process.env.VNP_HASH_SECRET!;
const vnp_Url = process.env.VNP_URL!;
const vnp_ReturnUrl = process.env.VNP_RETURN_URL!;

export interface VnPayCreatePaymentParams {
    orderId: string;
    amount: number;
    orderInfo: string;
    ipAddr: string;
    locale?: string;
}

export const vnpay = {
    createPaymentUrl(params: VnPayCreatePaymentParams): string {
        const date = new Date();
        const createDate = formatDate(date);
        const expireDate = formatDate(new Date(date.getTime() + 15 * 60 * 1000));

        // Tạo object params
        const vnp_Params: Record<string, string> = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: vnp_TmnCode,
            vnp_Locale: params.locale || 'vn',
            vnp_CurrCode: 'VND',
            vnp_TxnRef: params.orderId,
            vnp_OrderInfo: params.orderInfo,
            vnp_OrderType: 'other',
            vnp_Amount: String(Math.round(params.amount * 100)),
            vnp_ReturnUrl: vnp_ReturnUrl,
            vnp_IpAddr: params.ipAddr,
            vnp_CreateDate: createDate,
            vnp_ExpireDate: expireDate,
        };

        // Sort keys theo alphabet
        const sortedKeys = Object.keys(vnp_Params).sort();

        // Tạo query string để hash (không encode)
        const signData = sortedKeys
            .map(key => `${key}=${vnp_Params[key]}`)
            .join('&');

        console.log('Data to hash:', signData);

        // Tạo hash
        const hmac = crypto.createHmac('sha512', vnp_HashSecret);
        const signed = hmac.update(signData, 'utf-8').digest('hex');

        console.log('Generated hash:', signed);

        // Thêm hash vào params
        vnp_Params['vnp_SecureHash'] = signed;

        // Tạo URL với encode
        const urlParams = new URLSearchParams();
        Object.keys(vnp_Params).sort().forEach(key => {
            urlParams.append(key, vnp_Params[key]);
        });

        const paymentUrl = `${vnp_Url}?${urlParams.toString()}`;

        console.log('Payment URL:', paymentUrl);

        return paymentUrl;
    },

    // Verify return URL
    verifyReturnUrl(query: Record<string, string>): boolean {
        const vnp_SecureHash = query['vnp_SecureHash'];

        // Loại bỏ hash khỏi query để verify
        const paramsToVerify = { ...query };
        delete paramsToVerify['vnp_SecureHash'];
        delete paramsToVerify['vnp_SecureHashType'];

        // Sort và tạo sign data
        const sortedKeys = Object.keys(paramsToVerify).sort();
        const signData = sortedKeys
            .map(key => `${key}=${paramsToVerify[key]}`)
            .join('&');

        // Tạo hash để so sánh
        const hmac = crypto.createHmac('sha512', vnp_HashSecret);
        const signed = hmac.update(signData, 'utf-8').digest('hex');

        console.log('Verify - Data to hash:', signData);
        console.log('Verify - Generated hash:', signed);
        console.log('Verify - Received hash:', vnp_SecureHash);

        return signed === vnp_SecureHash;
    }
};

function formatDate(date: Date): string {
    const yyyy = date.getFullYear().toString();
    const MM = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${yyyy}${MM}${dd}${hh}${mm}${ss}`;
}