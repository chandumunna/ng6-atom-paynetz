import { Component } from '@angular/core';
import * as hash from 'js-sha512';
export class ProcessPaymentComponent {
    constructor() {
        this.mdd = null;
        this.bankId = null;
    }
    ngOnInit() {
    }
    setLoginid(login) {
        this.loginId = login;
    }
    setPassword(password) {
        this.password = password;
    }
    setURL(url) {
        this.url = url;
    }
    setClientCode(clientCode) {
        this.clientCode = clientCode;
    }
    setRequestHaskKey(requestHashKey) {
        this.requestHashKey = requestHashKey;
    }
    setResponseHashKey(responseHashKey) {
        this.responseHashKey = responseHashKey;
    }
    setProdId(prodid) {
        this.prodid = prodid;
    }
    setTxnId(txnid) {
        this.txnid = txnid;
    }
    setCustAcc(custacc) {
        this.custacc = custacc;
    }
    setAmount(amt) {
        this.amt = amt;
    }
    setCurrency(txncurr) {
        this.txncurr = txncurr;
    }
    setTxnType(txntype) {
        this.txntype = txntype;
    }
    setReturnUrl(returnURL) {
        this.returnURL = 'https://www.atomtech.in/angular-kit-handle/params_response.php';
    }
    setTxnsCamt(txnscamt) {
        this.txnscamt = txnscamt;
    }
    setCustomerName(udf1) {
        this.udf1 = udf1;
    }
    setCustomerEmail(udf2) {
        this.udf2 = udf2;
    }
    setCustomerMobile(udf3) {
        this.udf3 = udf3;
    }
    setCustomerAddress(udf4) {
        this.udf4 = udf4;
    }
    setMdd(mdd) {
        this.mdd = mdd;
    }
    setBankId(bankId) {
        this.bankId = bankId;
    }
    generateChecksum() {
        this.signature = this.loginId + this.password + this.txntype + this.prodid + this.txnid + this.amt + this.txncurr;
        return hash.sha512.hmac(this.requestHashKey, this.signature);
    }
    payNow() {
        let urlToPay = this.url;
        urlToPay += '?login=' + this.loginId;
        urlToPay += '&pass=' + this.password;
        urlToPay += '&ttype=' + this.txntype;
        urlToPay += '&prodid=' + this.prodid;
        urlToPay += '&amt=' + this.amt;
        urlToPay += '&txncurr=' + this.txncurr;
        urlToPay += '&txnscamt=' + this.txnscamt;
        urlToPay += '&clientcode=' + btoa(this.clientCode);
        urlToPay += '&txnid=' + this.txnid;
        urlToPay += '&date=' + this.formatDate(new Date);
        urlToPay += '&custacc=' + this.custacc;
        urlToPay += '&ru=' + this.returnURL;
        urlToPay += '&signature=' + this.generateChecksum();
        urlToPay += '&udf1=' + this.udf1;
        urlToPay += '&udf2=' + this.udf2;
        urlToPay += '&udf3=' + this.udf3;
        urlToPay += '&udf4=' + this.udf4;
        if (this.mdd != null) {
            urlToPay += '&mdd=' + this.mdd;
        }
        if (this.bankId != null) {
            urlToPay += '&bankid=' + this.bankId;
        }
        const url = encodeURI(urlToPay);
        let res = null;
        const left = (window.screen.width / 2) - ((1200 / 2) + 10);
        const top = '22%';
        const childWindow = window.open(url, 'Atom Paynetz', 'status=no,height=600,width=1200,resizable=yes,left='
            + left + ',top=' + top + ',screenX=' + left + ',screenY='
            + top + ',toolbar=no,menubar=no,scrollbars=no,location=no,directories=no');
        const promise = new Promise(resolve => {
            window.addEventListener('message', function (e) {
                if (e.origin === 'https://www.atomtech.in') {
                    res = e.data;
                    childWindow.close();
                }
            }, false);
            const intervalID = window.setInterval(checkWindow, 500);
            function checkWindow(e) {
                if (childWindow && childWindow.closed) {
                    if (res) {
                        this.response = res;
                        window.clearInterval(intervalID);
                        resolve({
                            status: true,
                            data: res,
                        });
                    }
                    else {
                        window.clearInterval(intervalID);
                        window.clearInterval(intervalID);
                        resolve({
                            status: false,
                            data: 'payment not completed',
                        });
                    }
                }
            }
        });
        return promise;
    }
    validateResponse(mmp_txn, mer_txn, f_code, prod, discriminator, amt, bank_txn, signature) {
        const string_verify = mmp_txn + mer_txn + f_code + prod + discriminator + amt + bank_txn;
        const sig = hash.sha512.hmac(this.responseHashKey, string_verify);
        if (signature === sig) {
            return {
                'status': true,
                'message': 'Signature matched = ' + sig + ' = ' + this.responseHashKey
            };
        }
        else {
            return {
                'status': false,
                'message': 'Signature mismatched = ' + sig + ' = ' + this.responseHashKey
            };
        }
    }
    formatDate(date) {
        const day = date.getDate();
        let monthIndex = date.getMonth() + 1;
        const year = date.getFullYear();
        const second = date.getSeconds();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        if (monthIndex < 10) {
            monthIndex = '0' + monthIndex;
        }
        return day + '/' + Number(monthIndex) + '/' + year + ' ' + hours + ':' + minutes + ':' + second;
    }
}
ProcessPaymentComponent.decorators = [
    { type: Component, args: [{
                selector: 'lib-config',
                template: `<p>
  config works!
</p>
`,
                styles: [``]
            },] },
];
ProcessPaymentComponent.ctorParameters = () => [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJvY2Vzc1BheW1lbnQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmc2LWF0b20tcGF5bmV0ei8iLCJzb3VyY2VzIjpbImxpYi9Qcm9jZXNzUGF5bWVudC9Qcm9jZXNzUGF5bWVudC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxNQUFNLGVBQWUsQ0FBQztBQUNsRCxPQUFPLEtBQUssSUFBSSxNQUFNLFdBQVcsQ0FBQztBQVdsQyxNQUFNO0lBeUJKO1FBUlEsUUFBRyxHQUFHLElBQUksQ0FBQztRQUNYLFdBQU0sR0FBRyxJQUFJLENBQUM7SUFRdEIsQ0FBQztJQUdELFFBQVE7SUFDUixDQUFDO0lBRUQsVUFBVSxDQUFDLEtBQWE7UUFDdEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7SUFDdkIsQ0FBQztJQUVELFdBQVcsQ0FBQyxRQUFnQjtRQUMxQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztJQUMzQixDQUFDO0lBRUQsTUFBTSxDQUFDLEdBQVc7UUFDaEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFDakIsQ0FBQztJQUVELGFBQWEsQ0FBQyxVQUFrQjtRQUM5QixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztJQUMvQixDQUFDO0lBRUQsaUJBQWlCLENBQUMsY0FBc0I7UUFDdEMsSUFBSSxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUM7SUFDdkMsQ0FBQztJQUVELGtCQUFrQixDQUFDLGVBQXVCO1FBQ3hDLElBQUksQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDO0lBQ3pDLENBQUM7SUFFRCxTQUFTLENBQUMsTUFBYztRQUN0QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBRUQsUUFBUSxDQUFDLEtBQWE7UUFDcEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDckIsQ0FBQztJQUVELFVBQVUs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LEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsT0FBTyxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUM7SUFDbEcsQ0FBQzs7O1lBcE9GLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsWUFBWTtnQkFDdEIsUUFBUSxFQUFFOzs7Q0FHWDtnQkFDQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUM7YUFDYiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCAqIGFzIGhhc2ggZnJvbSAnanMtc2hhNTEyJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbGliLWNvbmZpZycsXHJcbiAgdGVtcGxhdGU6IGA8cD5cclxuICBjb25maWcgd29ya3MhXHJcbjwvcD5cclxuYCxcclxuICBzdHlsZXM6IFtgYF1cclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBQcm9jZXNzUGF5bWVudENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblxyXG4gIHByaXZhdGUgbG9naW5JZDogYW55O1xyXG4gIHByaXZhdGUgcGFzc3dvcmQ6IGFueTtcclxuICBwcml2YXRlIHVybDogYW55O1xyXG4gIHByaXZhdGUgY2xpZW50Q29kZTogYW55O1xyXG4gIHByaXZhdGUgcmVxdWVzdEhhc2hLZXk6IGFueTtcclxuICBwcml2YXRlIHJlc3BvbnNlSGFzaEtleTogYW55O1xyXG4gIHByaXZhdGUgcHJvZGlkOiBhbnk7XHJcbiAgcHJpdmF0ZSBzaWduYXR1cmU6IGFueTtcclxuICBwcml2YXRlIGFtdDogYW55O1xyXG4gIHByaXZhdGUgdHhuY3VycjogYW55O1xyXG4gIHByaXZhdGUgdHhudHlwZTogYW55O1xyXG4gIHByaXZhdGUgdHhuc2NhbXQ6IGFueTtcclxuICBwcml2YXRlIHR4bmlkOiBhbnk7XHJcbiAgcHJpdmF0ZSBjdXN0YWNjOiBhbnk7XHJcbiAgcHJpdmF0ZSByZXR1cm5VUkw6IGFueTtcclxuICBwcml2YXRlIG1kZCA9IG51bGw7XHJcbiAgcHJpdmF0ZSBiYW5rSWQgPSBudWxsO1xyXG4gIHByaXZhdGUgdWRmMTogYW55O1xyXG4gIHByaXZhdGUgdWRmMjogYW55O1xyXG4gIHByaXZhdGUgdWRmMzogYW55O1xyXG4gIHByaXZhdGUgdWRmNDogYW55O1xyXG4gIHByaXZhdGUgY2hpbGRXaW5kb3c6IGFueTtcclxuICBwcml2YXRlIHJlc3BvbnNlOiBhbnk7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgfVxyXG5cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgfVxyXG5cclxuICBzZXRMb2dpbmlkKGxvZ2luOiBzdHJpbmcpIHtcclxuICAgIHRoaXMubG9naW5JZCA9IGxvZ2luO1xyXG4gIH1cclxuXHJcbiAgc2V0UGFzc3dvcmQocGFzc3dvcmQ6IHN0cmluZykge1xyXG4gICAgdGhpcy5wYXNzd29yZCA9IHBhc3N3b3JkO1xyXG4gIH1cclxuXHJcbiAgc2V0VVJMKHVybDogc3RyaW5nKSB7XHJcbiAgICB0aGlzLnVybCA9IHVybDtcclxuICB9XHJcblxyXG4gIHNldENsaWVudENvZGUoY2xpZW50Q29kZTogc3RyaW5nKSB7XHJcbiAgICB0aGlzLmNsaWVudENvZGUgPSBjbGllbnRDb2RlO1xyXG4gIH1cclxuXHJcbiAgc2V0UmVxdWVzdEhhc2tLZXkocmVxdWVzdEhhc2hLZXk6IHN0cmluZykge1xyXG4gICAgdGhpcy5yZXF1ZXN0SGFzaEtleSA9IHJlcXVlc3RIYXNoS2V5O1xyXG4gIH1cclxuXHJcbiAgc2V0UmVzcG9uc2VIYXNoS2V5KHJlc3BvbnNlSGFzaEtleTogc3RyaW5nKSB7XHJcbiAgICB0aGlzLnJlc3BvbnNlSGFzaEtleSA9IHJlc3BvbnNlSGFzaEtleTtcclxuICB9XHJcblxyXG4gIHNldFByb2RJZChwcm9kaWQ6IHN0cmluZykge1xyXG4gICAgdGhpcy5wcm9kaWQgPSBwcm9kaWQ7XHJcbiAgfVxyXG5cclxuICBzZXRUeG5JZCh0eG5pZDogc3RyaW5nKSB7XHJcbiAgICB0aGlzLnR4bmlkID0gdHhuaWQ7XHJcbiAgfVxyXG5cclxuICBzZXRDdXN0QWNjKGN1c3RhY2M6IHN0cmluZykge1xyXG4gICAgdGhpcy5jdXN0YWNjID0gY3VzdGFjYztcclxuICB9XHJcblxyXG4gIHNldEFtb3VudChhbXQ6IHN0cmluZykge1xyXG4gICAgdGhpcy5hbXQgPSBhbXQ7XHJcbiAgfVxyXG5cclxuICBzZXRDdXJyZW5jeSh0eG5jdXJyOiBzdHJpbmcpIHtcclxuICAgIHRoaXMudHhuY3VyciA9IHR4bmN1cnI7XHJcbiAgfVxyXG5cclxuICBzZXRUeG5UeXBlKHR4bnR5cGU6IHN0cmluZykge1xyXG4gICAgdGhpcy50eG50eXBlID0gdHhudHlwZTtcclxuICB9XHJcblxyXG4gIHNldFJldHVyblVybChyZXR1cm5VUkw6IHN0cmluZykge1xyXG4gICAgdGhpcy5yZXR1cm5VUkwgPSAnaHR0cHM6Ly93d3cuYXRvbXRlY2guaW4vYW5ndWxhci1raXQtaGFuZGxlL3BhcmFtc19yZXNwb25zZS5waHAnO1xyXG4gIH1cclxuXHJcbiAgc2V0VHhuc0NhbXQodHhuc2NhbXQ6IHN0cmluZykge1xyXG4gICAgdGhpcy50eG5zY2FtdCA9IHR4bnNjYW10O1xyXG4gIH1cclxuXHJcbiAgc2V0Q3VzdG9tZXJOYW1lKHVkZjE6IHN0cmluZykge1xyXG4gICAgdGhpcy51ZGYxID0gdWRmMTtcclxuICB9XHJcblxyXG4gIHNldEN1c3RvbWVyRW1haWwodWRmMjogc3RyaW5nKSB7XHJcbiAgICB0aGlzLnVkZjIgPSB1ZGYyO1xyXG4gIH1cclxuXHJcbiAgc2V0Q3VzdG9tZXJNb2JpbGUodWRmMzogc3RyaW5nKSB7XHJcbiAgICB0aGlzLnVkZjMgPSB1ZGYzO1xyXG4gIH1cclxuXHJcbiAgc2V0Q3VzdG9tZXJBZGRyZXNzKHVkZjQ6IHN0cmluZykge1xyXG4gICAgdGhpcy51ZGY0ID0gdWRmNDtcclxuICB9XHJcblxyXG4gIHNldE1kZChtZGQ6IHN0cmluZykge1xyXG4gICAgdGhpcy5tZGQgPSBtZGQ7XHJcbiAgfVxyXG5cclxuICBzZXRCYW5rSWQoYmFua0lkOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuYmFua0lkID0gYmFua0lkO1xyXG4gIH1cclxuICBnZW5lcmF0ZUNoZWNrc3VtKCkge1xyXG4gICAgdGhpcy5zaWduYXR1cmUgPSB0aGlzLmxvZ2luSWQgKyB0aGlzLnBhc3N3b3JkICsgdGhpcy50eG50eXBlICsgdGhpcy5wcm9kaWQgKyB0aGlzLnR4bmlkICsgdGhpcy5hbXQgKyB0aGlzLnR4bmN1cnI7XHJcbiAgICByZXR1cm4gaGFzaC5zaGE1MTIuaG1hYyh0aGlzLnJlcXVlc3RIYXNoS2V5LCB0aGlzLnNpZ25hdHVyZSk7XHJcbiAgfVxyXG5cclxuXHJcblxyXG4gIHBheU5vdygpIHtcclxuXHJcbiAgICBsZXQgdXJsVG9QYXkgPSB0aGlzLnVybDtcclxuICAgIHVybFRvUGF5ICs9ICc/bG9naW49JyArIHRoaXMubG9naW5JZDtcclxuICAgIHVybFRvUGF5ICs9ICcmcGFzcz0nICsgdGhpcy5wYXNzd29yZDtcclxuICAgIHVybFRvUGF5ICs9ICcmdHR5cGU9JyArIHRoaXMudHhudHlwZTtcclxuICAgIHVybFRvUGF5ICs9ICcmcHJvZGlkPScgKyB0aGlzLnByb2RpZDtcclxuICAgIHVybFRvUGF5ICs9ICcmYW10PScgKyB0aGlzLmFtdDtcclxuICAgIHVybFRvUGF5ICs9ICcmdHhuY3Vycj0nICsgdGhpcy50eG5jdXJyO1xyXG4gICAgdXJsVG9QYXkgKz0gJyZ0eG5zY2FtdD0nICsgdGhpcy50eG5zY2FtdDtcclxuICAgIHVybFRvUGF5ICs9ICcmY2xpZW50Y29kZT0nICsgYnRvYSh0aGlzLmNsaWVudENvZGUpO1xyXG4gICAgdXJsVG9QYXkgKz0gJyZ0eG5pZD0nICsgdGhpcy50eG5pZDtcclxuICAgIHVybFRvUGF5ICs9ICcmZGF0ZT0nICsgdGhpcy5mb3JtYXREYXRlKG5ldyBEYXRlKTtcclxuICAgIHVybFRvUGF5ICs9ICcmY3VzdGFjYz0nICsgdGhpcy5jdXN0YWNjO1xyXG4gICAgdXJsVG9QYXkgKz0gJyZydT0nICsgdGhpcy5yZXR1cm5VUkw7XHJcbiAgICB1cmxUb1BheSArPSAnJnNpZ25hdHVyZT0nICsgdGhpcy5nZW5lcmF0ZUNoZWNrc3VtKCk7XHJcbiAgICB1cmxUb1BheSArPSAnJnVkZjE9JyArIHRoaXMudWRmMTtcclxuICAgIHVybFRvUGF5ICs9ICcmdWRmMj0nICsgdGhpcy51ZGYyO1xyXG4gICAgdXJsVG9QYXkgKz0gJyZ1ZGYzPScgKyB0aGlzLnVkZjM7XHJcbiAgICB1cmxUb1BheSArPSAnJnVkZjQ9JyArIHRoaXMudWRmNDtcclxuXHJcbiAgICBpZiAodGhpcy5tZGQgIT0gbnVsbCkge1xyXG4gICAgICB1cmxUb1BheSArPSAnJm1kZD0nICsgdGhpcy5tZGQ7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuYmFua0lkICE9IG51bGwpIHtcclxuICAgICAgdXJsVG9QYXkgKz0gJyZiYW5raWQ9JyArIHRoaXMuYmFua0lkO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHVybCA9IGVuY29kZVVSSSh1cmxUb1BheSk7XHJcbiAgICBsZXQgcmVzID0gbnVsbDtcclxuXHJcbiAgICBjb25zdCBsZWZ0ID0gKHdpbmRvdy5zY3JlZW4ud2lkdGggLyAyKSAtICgoMTIwMCAvIDIpICsgMTApO1xyXG4gICAgY29uc3QgdG9wID0gJzIyJSc7XHJcblxyXG4gICAgY29uc3QgY2hpbGRXaW5kb3cgPSB3aW5kb3cub3Blbih1cmwsICdBdG9tIFBheW5ldHonLCAnc3RhdHVzPW5vLGhlaWdodD02MDAsd2lkdGg9MTIwMCxyZXNpemFibGU9eWVzLGxlZnQ9J1xyXG4gICAgICArIGxlZnQgKyAnLHRvcD0nICsgdG9wICsgJyxzY3JlZW5YPScgKyBsZWZ0ICsgJyxzY3JlZW5ZPSdcclxuICAgICAgKyB0b3AgKyAnLHRvb2xiYXI9bm8sbWVudWJhcj1ubyxzY3JvbGxiYXJzPW5vLGxvY2F0aW9uPW5vLGRpcmVjdG9yaWVzPW5vJyk7XHJcblxyXG4gICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgaWYgKGUub3JpZ2luID09PSAnaHR0cHM6Ly93d3cuYXRvbXRlY2guaW4nKSB7XHJcbiAgICAgICAgICByZXMgPSBlLmRhdGE7XHJcbiAgICAgICAgICBjaGlsZFdpbmRvdy5jbG9zZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSwgZmFsc2UpO1xyXG4gICAgICBjb25zdCBpbnRlcnZhbElEID0gd2luZG93LnNldEludGVydmFsKGNoZWNrV2luZG93LCA1MDApO1xyXG4gICAgICBmdW5jdGlvbiBjaGVja1dpbmRvdyhlOiBhbnkpIHtcclxuICAgICAgICBpZiAoY2hpbGRXaW5kb3cgJiYgY2hpbGRXaW5kb3cuY2xvc2VkKSB7XHJcbiAgICAgICAgICBpZiAocmVzKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVzcG9uc2UgPSByZXM7XHJcbiAgICAgICAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKGludGVydmFsSUQpO1xyXG4gICAgICAgICAgICByZXNvbHZlKHtcclxuICAgICAgICAgICAgICBzdGF0dXM6IHRydWUsXHJcbiAgICAgICAgICAgICAgZGF0YTogcmVzLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKGludGVydmFsSUQpO1xyXG4gICAgICAgICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbChpbnRlcnZhbElEKTtcclxuICAgICAgICAgICAgcmVzb2x2ZSh7XHJcbiAgICAgICAgICAgICAgc3RhdHVzOiBmYWxzZSxcclxuICAgICAgICAgICAgICBkYXRhOiAncGF5bWVudCBub3QgY29tcGxldGVkJyxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHByb21pc2U7XHJcblxyXG4gIH1cclxuXHJcbiAgdmFsaWRhdGVSZXNwb25zZShtbXBfdHhuOiBhbnksIG1lcl90eG46IGFueSwgZl9jb2RlOiBhbnksIHByb2Q6IGFueSwgZGlzY3JpbWluYXRvcjogYW55LCBhbXQ6IGFueSwgYmFua190eG46IGFueSwgc2lnbmF0dXJlOiBhbnkpIHtcclxuICAgIGNvbnN0IHN0cmluZ192ZXJpZnkgPSBtbXBfdHhuICsgbWVyX3R4biArIGZfY29kZSArIHByb2QgKyBkaXNjcmltaW5hdG9yICsgYW10ICsgYmFua190eG47XHJcbiAgICBjb25zdCBzaWcgPSBoYXNoLnNoYTUxMi5obWFjKHRoaXMucmVzcG9uc2VIYXNoS2V5LCBzdHJpbmdfdmVyaWZ5KTtcclxuXHJcbiAgICBpZiAoc2lnbmF0dXJlID09PSBzaWcpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAnc3RhdHVzJzogdHJ1ZSxcclxuICAgICAgICAnbWVzc2FnZSc6ICdTaWduYXR1cmUgbWF0Y2hlZCA9ICcgKyBzaWcgKyAnID0gJyArIHRoaXMucmVzcG9uc2VIYXNoS2V5XHJcbiAgICAgIH07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgICdzdGF0dXMnOiBmYWxzZSxcclxuICAgICAgICAnbWVzc2FnZSc6ICdTaWduYXR1cmUgbWlzbWF0Y2hlZCA9ICcgKyBzaWcgKyAnID0gJyArIHRoaXMucmVzcG9uc2VIYXNoS2V5XHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmb3JtYXREYXRlKGRhdGU6IGFueSkge1xyXG4gICAgY29uc3QgZGF5ID0gZGF0ZS5nZXREYXRlKCk7XHJcbiAgICBsZXQgbW9udGhJbmRleCA9IGRhdGUuZ2V0TW9udGgoKSArIDE7XHJcbiAgICBjb25zdCB5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xyXG4gICAgY29uc3Qgc2Vjb25kID0gZGF0ZS5nZXRTZWNvbmRzKCk7XHJcbiAgICBjb25zdCBob3VycyA9IGRhdGUuZ2V0SG91cnMoKTtcclxuICAgIGNvbnN0IG1pbnV0ZXMgPSBkYXRlLmdldE1pbnV0ZXMoKTtcclxuICAgIGlmIChtb250aEluZGV4IDwgMTApIHtcclxuICAgICAgbW9udGhJbmRleCA9ICcwJyArIG1vbnRoSW5kZXg7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGF5ICsgJy8nICsgTnVtYmVyKG1vbnRoSW5kZXgpICsgJy8nICsgeWVhciArICcgJyArIGhvdXJzICsgJzonICsgbWludXRlcyArICc6JyArIHNlY29uZDtcclxuICB9XHJcblxyXG59XHJcbiJdfQ==