class GalleryEntity {
	constructor({ _id, name, description, user, images = [] }) {
		this._id = _id;
		this.name = name;
		this.description = description;
		this.user = user;
		this.images = images;

		return Object.freeze({
			_id: this._id,
			name: this.name,
			description: this.description,
			user: this.user,
			images: this.images,
		});
	}
}
export default GalleryEntity;
