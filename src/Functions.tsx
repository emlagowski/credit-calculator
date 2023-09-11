/* Based on https://gist.github.com/pies/4166888 */
const ExcelFormulas = {

    // PMT(stopa-okresu; liczba-okresów; wartość-bieżąca; wartość-przyszła; kiedy-należne)

	PMT: function(rate: number, nper: number, pv: number, fv: number, type: number) {
		if (!fv) fv = 0;
		if (!type) type = 0;

		if (rate == 0) return -(pv + fv)/nper;
		
		var pvif = Math.pow(1 + rate, nper);
		var pmt = rate / (pvif - 1) * -(pv * pvif + fv);

		if (type == 1) {
			pmt /= (1 + rate);
		};

		return pmt;
	},

    // IPMT(stopa-okresu; okres; liczba-okresów; wartość-bieżąca; wartość-przyszła; kiedy-należne)

	IPMT: function(pv: number, pmt: number, rate: number, per: number) {
		var tmp = Math.pow(1 + rate, per);
		return 0 - (pv * tmp * rate + pmt * (tmp - 1));
	},

    // PPMT(stopa-okresu; okres; liczba-okresów; wartość-bieżąca; wartość-przyszła; kiedy-należne)

	PPMT: function(rate: number, per: number, nper: number, pv: number, fv: number, type: number) {
		if (per < 1 || (per >= nper + 1)) return null;
		var pmt = this.PMT(rate, nper, pv, fv, type);
		var ipmt = this.IPMT(pv, pmt, rate, per - 1);
		return pmt - ipmt;
	},

};

export default ExcelFormulas;