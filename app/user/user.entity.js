class UserEntity {
	constructor({
		_id,
		fullName,
		email,
		about = null,
		password,
		galleries = [],
		images = [],
		bookmarks = [],
	}) {
		this._id = _id;
		this.fullName = fullName;
		this.email = email;
		this.about = about;
		this.password = password;
		this.galleries = galleries;
		this.images = images;
		this.bookmarks = bookmarks;

		return Object.freeze({
			_id: this._id,
			fullName: this.fullName,
			email: this.email,
			about: this.about,
			password: this.password,
			galleries: this.galleries,
			images: this.images,
			bookmarks: this.bookmarks,
		});
	}
}
export default UserEntity;
