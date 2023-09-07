let name = 'A';
const sum = function sum(...params) {
    return params.reduce((res, item) => {
        return res + item;
    }, 0);
};

// 模块导出
export default sum;