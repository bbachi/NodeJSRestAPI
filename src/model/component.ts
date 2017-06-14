interface IComponent {
    itemId: string;
    itemType: string;
    keyName: string;
    publicationId: string;
    stringValue: string;
    author: string;
    createdDate: Date;
    modifyDate: Date;
    title: string;
    priority: number;
    componentPresUrl: string;
    region: string;
}

export class Component implements IComponent {

    itemId: string;
    itemType: string;
    keyName: string;
    publicationId: string;
    stringValue: string;
    author: string;
    createdDate: Date;
    modifyDate: Date;
    title: string;
    priority: number;
    componentPresUrl: string;
    region: string;
}