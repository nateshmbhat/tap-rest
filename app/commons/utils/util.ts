import { remote } from "electron";
import type { OpenDialogReturnValue } from "electron/main";
import faker from 'faker';
import type { TabConfigModel } from "../types";
import type http from 'http'

export class StringUtil {
    static jsonStringify(message: any, indentSpace = 2): string {
        if (typeof message === 'string') return message
        return JSON.stringify(message, null, indentSpace)
    }
}

export class TabUtil {
    static async getTabConfigFromRpc(rpcProtoInfo: any): Promise<TabConfigModel | undefined> {
        return
    }
}


export class FileSystemUtil {
    static async getProtoFilesFromFilePicker(): Promise<OpenDialogReturnValue> {
        const result = await remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
            properties: ['openFile', 'multiSelections'],
            buttonLabel: 'Import Proto',
            filters: [
                { name: 'Protos', extensions: ['proto'] },
            ]
        });
        return result;
    }

    static async getProtoResolvePathsFromFilePicker(): Promise<OpenDialogReturnValue> {
        const result = await remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
            properties: ['openDirectory'],
            buttonLabel: 'Add Proto Path',
            filters: []
        });
        return result;
    }
}

export class HttpHeaderUtil {
    static isContentJson(headers: http.IncomingHttpHeaders): boolean {
        const contentType = headers["content-type"];
        if (
            contentType !== undefined &&
            (contentType.indexOf("application/json") >= 0 || contentType.indexOf("application/vnd.api+json") >= 0)
        ) {
            return true
        }
        return false
    }

    static removeHopByHopAndEncodingHeaders(headers: http.IncomingHttpHeaders) : http.IncomingHttpHeaders {
        const modifiableHeaders = HttpHeaderUtil.removeHopByHopHeaders(headers)
        delete modifiableHeaders['content-encoding']
        return modifiableHeaders
    }

    static filterSafeHeaders(headers: http.IncomingHttpHeaders) {
        const unsafeHeaders = new Set([
            'accept-charset',
            'accept-encoding',
            'access-control-request-headers',
            'access-control-request-method',
            'connection',
            'content-length',
            'cookie',
            'cookie2',
            'date',
            'dNT',
            'expect',
            'feature-policy',
            'host',
            'origin',
            'keep-alive',
            'proxy-',
            'sec-',
            'referer',
            'tE',
            'trailer',
            'transfer-encoding',
            'upgrade',
            'via',
            'user-agent',
        ])
        const safeHeaders: { [header: string]: string | string[] | undefined } = {}
        for (let header in headers) {
            const lowerCasedHeader = header.toLowerCase()
            if (lowerCasedHeader.startsWith('proxy-') || lowerCasedHeader.startsWith('sec-') || unsafeHeaders.has(lowerCasedHeader)) {
                continue
            }
            safeHeaders[header] = headers[header]
        }
        return safeHeaders
    }
    static removeHopByHopHeaders(headers: http.IncomingHttpHeaders): http.IncomingHttpHeaders {
        const nonHopHeaders: http.IncomingHttpHeaders = {}
        const hopByHopHeaders = new Set([
            'keep-alive', 'transfer-encoding', 'te', 'connection', 'trailer', 'upgrade', 'proxy-authorization', 'proxy-authenticate'
        ])
        for (let [key, value] of Object.entries(headers)) {
            if (key.toLowerCase().trim() === 'connection') {
                const connectionValues = (value as string).split(',')
                connectionValues.map(e => e.toLowerCase().trim()).forEach(cv => hopByHopHeaders.add(cv))
            }
        }

        for (let [key, value] of Object.entries(headers)) {
            if (!hopByHopHeaders.has(key.toLowerCase().trim())) {
                nonHopHeaders[key] = value
            }
        }

        return nonHopHeaders
    }
}

export class FakerUtil {
    static generateFakeJsonObject(object: { [key: string]: any }): Object {
        const result: { [key: string]: any } = {}
        for (let [key, value] of Object.entries(object)) {
            if (typeof value === 'string') {
                result[key] = this.getStringValue(key, value)
            }
            else if (typeof value === 'boolean') {
                result[key] = faker.random.boolean()
            }
            else if (typeof value === 'number') {
                result[key] = this.getNumberValue(key, value)
            }

            else if (Array.isArray(value) && value.length > 0) {
                const newArray = [...new Array(faker.random.number(4) + 1)].map(e => value[0])
                for (let arrayIndex in newArray) {
                    const arrayItem = newArray[arrayIndex]
                    if (typeof arrayItem === 'string') {
                        newArray[arrayIndex] = this.getStringValue(key, arrayItem)
                    }
                    else if (typeof arrayItem === 'boolean') {
                        newArray[arrayIndex] = faker.random.boolean()
                    }
                    else if (typeof arrayItem === 'number') {
                        newArray[arrayIndex] = this.getNumberValue(key, arrayItem)
                    }
                    else if (typeof arrayItem === 'object') {
                        const newArrayItem = this.generateFakeJsonObject(arrayItem)
                        newArray[arrayIndex] = newArrayItem
                    }
                }
                result[key] = newArray
            }

            else if (typeof value === 'object') {
                result[key] = this.generateFakeJsonObject(value)
            }
        }
        return result
    }

    private static getStringValue(key: string, value: string): string {
        key = key.trim().toLowerCase().replace(' ', '').replace('_', '')
        switch (key) {
            case 'zipcode': return faker.address.zipCode()
            case 'city': return faker.address.city()
            case 'state': return faker.address.state()
            case 'country': return faker.address.country()
            case 'countrycode': return faker.address.countryCode()
            case 'latitude': return faker.address.latitude()
            case 'longitude': return faker.address.longitude()
            case 'timeZone': return faker.address.timeZone()

            case 'homeaddress':
            case 'address':
            case 'shippingaddress':
            case 'houseaddress':
            case 'residenceaddress': return faker.address.streetAddress(true) + `, ${faker.address.city()}, ${faker.address.state()}`

            case 'color': return faker.commerce.color()
            case 'price': return faker.commerce.price()
            case 'department': return faker.commerce.department()

            case 'expirydate':
            case 'expiry':
            case 'expireson':
            case 'date': return faker.date.future().toString()

            case 'cost':
            case 'expenditure':
            case 'price': return faker.finance.amount()

            case 'cardnumber':
            case 'creditcardnumber':
            case 'creditcard':
            case 'debitcardnumber':
            case 'debitcard': return faker.finance.creditCardNumber()

            case 'cardcvv':
            case 'creditcardcvv':
            case 'cvvnumber':
            case 'cvvdigits':
            case 'cvv': return faker.finance.creditCardCVV()

            case 'currencycode': return faker.finance.currencyCode()

            case 'image':
            case 'iconurl':
            case 'thumbnail':
            case 'thumbnailimage':
            case 'thumbnailurl':
            case 'imageurl': return faker.random.image()

            case 'avatarimage': return faker.internet.avatar()

            case 'username': return faker.internet.userName()

            case 'useragent': return faker.internet.userAgent()
            case 'email': return faker.internet.email()

            case 'phonenumber':
            case 'mobile':
            case 'mobilenumber':
            case 'phone': return faker.phone.phoneNumber()

            case 'id':
            case 'uuid': return faker.random.uuid()

            case 'filename':
            case 'file': return faker.system.fileName()

            case 'filepath': return faker.system.filePath()

            case 'folder':
            case 'folderpath':
            case 'directorypath':
            case 'foldername': return faker.system.directoryPath()

            case 'firstname': return faker.name.firstName()
            case 'lastname': return faker.name.lastName()

            case 'jobtitle': return faker.name.jobTitle()
            case 'profession': return faker.name.jobTitle()
            case 'area': return faker.name.jobTitle()

            case 'sex':
            case 'gender': return faker.name.gender()

            case 'timestamp': return Date.now().toString()
            case 'name': return faker.name.findName()

            case 'description':
            case 'sentence': return faker.lorem.sentence()

            case 'message': return faker.lorem.sentences(faker.random.number(3) + 1)

            case 'storyline':
            case 'body': return faker.lorem.paragraph()
        }

        if (key.endsWith('id')) return faker.random.uuid()
        return faker.random.word()
    }

    private static getNumberValue(key: string, value: number): number {
        switch (key) {
            case 'age': return faker.random.number(100)
            case 'lat': return Number.parseFloat(faker.address.latitude())
            case 'long': return Number.parseFloat(faker.address.longitude())
            case 'rating': return faker.random.number(5)
            case 'year': return new Date().getFullYear()
            case 'month': return new Date().getMonth()
            case 'day': return new Date().getDay()
        }
        return faker.random.number(1000)
    }
}