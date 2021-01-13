class GalleryEntity {
	constructor({
		_id,
		name,
		description,
		user,
		type = 'original',
		clone = null,
		images = [],
	}) {
		this._id = _id;
		this.name = name;
		this.description = description;
		this.user = user;
		this.type = type;
		this.clone = clone;
		this.images = images;

		return Object.freeze({
			_id: this._id,
			name: this.name,
			description: this.description,
			user: this.user,
			type: this.type,
			clone: this.clone,
			images: this.images,
		});
	}
}
export default GalleryEntity;
