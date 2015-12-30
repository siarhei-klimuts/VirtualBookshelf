import SelectorMeta from './SelectorMeta';

export default class SelectorMetaDto extends SelectorMeta {
	constructor(type, id, parentId) {
		super();
		
		this.type = type;
		this.id = id;
		this.parentId = parentId;
	}
}