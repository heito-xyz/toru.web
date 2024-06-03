export interface DeviceItem {
    name: string,
    icon: string
}

export interface DeviceItemRegex extends DeviceItem {
    regex: RegExp;
}

class Device {
    private userAgent: string = '';

    private readonly listOS: Array<DeviceItemRegex> = [
        { name: 'Android', icon: 'android', regex: /Android/i },
        { name: 'iPhone', icon: 'apple', regex: /iPhone/i },
        { name: 'iPad', icon: 'ipad', regex: /iPad/i },
        { name: 'Windows Phone', icon: 'windows', regex: /Windows Phone/i },
        { name: 'Tablet OS', icon: '', regex: /Tablet OS/i },
        { name: 'Linux', icon: 'linux', regex: /Linux/i },
        { name: 'Windows', icon: 'windows', regex: /Windows NTi/ },
        { name: 'Macintosh', icon: 'mac-command', regex: /Macintosh/i },
        { name: 'cURL', icon: '', regex: /curl/i },
        { name: 'Postman', icon: 'postman', regex: /Postman/i },
        { name: 'WebOS', icon: '', regex: /webOS/i }
    ];

    private readonly listBrowsers: Array<DeviceItemRegex> = [
        { name: 'Chrome', icon: 'chrome', regex: /Chrome/i },
        { name: 'Internet Explorer', icon: 'ie', regex: /MSIE/i },
        { name: 'Firefox', icon: 'firefox', regex: /Firefox/i },
        { name: 'Safari', icon: 'safari', regex: /Safari/i },
        { name: 'Opera', icon: 'opera', regex: /OP/i },
    ];

    getInfo(userAgent: string) {
        this.userAgent = userAgent;

        const os: DeviceItem = this.setOS();
        const browser: DeviceItem = this.setBrowser();

        return {
            os,
            browser
        };
    }

    private setOS() {
        const os = this.listOS.find(os => os.regex.test(this.userAgent));

        return {
            name: os?.name || '',
            icon: os?.icon || ''
        }
    }

    private setBrowser() {
        const browser = this.listBrowsers.find(os => os.regex.test(this.userAgent));

        return {
            name: browser?.name || '',
            icon: browser?.icon || ''
        }
    }
}

export const $device = new Device();