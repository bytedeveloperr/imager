class ImageEntity {
	constructor({
		_id,
		name,
		path,
		mime,
		size,
		title,
		tags = null,
		license,
		credits = null,
		description,
		user,
		album,
	}) {
		this._id = _id;
		this.name = name;
		this.path = path;
		this.mime = mime;
		this.size = size;
		this.title = title;
		this.tags = tags;
		this.license = license;
		this.credits = credits;
		this.description = description;
		this.user = user;
		this.album = album;

		return Object.freeze({
			_id: this._id,
			name: this.name,
			path: this.path,
			mime: this.mime,
			size: this.size,
			title: this.title,
			tags: this.tags,
			license: this.license,
			credits: this.credits,
			description: this.description,
			user: this.user,
			album: this.album,
		});
	}
}
export default ImageEntity;
