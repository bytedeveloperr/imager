// import { UserService } from '../app/user/index.js';
// import { ImageService } from '../app/image/index.js';
// import { AlbumService } from '../app/album/index.js';

const permissions = {
	canUpdate(user, item) {
		return user._id === item.user;
	},
	canDelete(user, item) {
		return user._id === item.user;
	},
};

export default permissions;
