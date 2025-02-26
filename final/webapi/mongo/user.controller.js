// thực hiện thao tác CRUD với monggo

const userModel = require('./user.model');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
module.exports = { gettAll , insert , updateById, remove, register, login} // ,, getByKey, updateById, remove

  // xử lí dữ liệu ở contronller
  async function register(body) {
    try {
        const { name, email, pass, phone } = body;
        let user = await userModel.findOne({ email: email });
        if (user) {
            throw new Error('Email đã tồn tại');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(pass, salt);

        // Tạo mới người dùng
        user = new userModel({ name, email, pass: hashedPassword, phone});

        const result = await user.save();
        return result;
    } catch (error) {
        console.log('Lỗi đăng ký:', error);
        throw error;
    }
  }


async function gettAll (){
    try {
        const result = await userModel.find();
        return result;
    } catch (error) {
        console.log('Lỗi lấy danh sách user', error);
        throw error;
    }

}

// thêm danh mục

async function insert (body){
    try {
        const {name, email, pass, phone, role} = body
        // console.log("usergory Name:", name);
        // console.log("usergory mota:", description);
        const userNew = new userModel({
            name, email, pass, phone, role

        })
        // lưu database
        const result = await userNew.save();
        return result;
    } catch (error) {
        console.log('Lỗi', error);
        throw error
    }
}



// cập nhật danh mục theo id

async function updateById(id, body) {
    try {
        const user = await userModel.findById(id);
        if (!user) {
            throw new Error ('Không tìm thấy danh mục');
        }
        const {name, email, pass, phone, role} = body;
        const result = await userModel.findByIdAndUpdate(
            id,
            {name, email, pass, phone, role},
        )
        return result;
    } catch (error) {
        console.log("lỗi update", error);
        throw error;
    }

}







// xóa danh mục theo id
async function remove(id) {
    try {
        const result = await userModel.findByIdAndDelete(id);
        return result;
    } catch (error) {
        console.log('LỖI XÓA USER THEO ID', error);
        throw error;
    }

}


async function login(body) {
    try {
        const { email, pass } = body;
        const user = await userModel.findOne({ email:email  });
        if (!user) {
            return res.status(404).json({ message: 'Người dùng chưa đăng ký' });
        }
     

        const isPasswordValid = await bcrypt.compare(pass, user.pass);
          console.log(isPasswordValid);
        if (!isPasswordValid) {
            throw new Error('Mật khẩu không chính xác');
        }

        delete user._doc.pass;

        const accessToken = jwt.sign(
            { _id: user._id, email: user.email, name: user.name, roles: user.role },
            'access_token_secret',
            { expiresIn: '1m' }
        );

        // Tạo refresh token có hạn trong 1 phút
        const refreshToken = jwt.sign(
            { _id: user._id, email: user.email,  name: user.name,roles: user.role },
            'refresh_token_secret',
            { expiresIn: '1h' }
        );

        // Lưu trữ refresh token vào cơ sở dữ liệu hoặc bộ nhớ của máy chủ

        // Gửi thông tin người dùng cùng với access token và refresh token về cho client
        return { user: user, accessToken: accessToken, refreshToken: refreshToken };
    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        throw error;
    }
}


// async function login(body) {
//     try {
//         // lấy dữ liệu
//         const {email , pass} = body;
//         // kiem tra email
//         let user = await userModel.findOne({email : email})
//         if (!user) {
//             throw new Error('Email khong ton tai')
//         }
//         // kiểm tra pass
//         const checkpass = bcrypt.compareSync(pass, user.pass)
//         if (!checkpass) {
//             throw new Error('Mật khẩu không chính xác')
//         }
//         //xóa field pass
//         delete user._doc.pass
//         // tạo token
//         const token = jwt.sign(
//             {_id : user._id, email : user.email, role : user.role},
//             'duongdiem', // key secret
//             {expiresIn: 1 * 1 *60 } // thời gian hết hạn của token
//         )

//         user = {...user._doc, token}
//         return user
//     } catch (error) {
//         console.log('LỖI', error);
//         throw error;
//     }
// }
//muốn xem sản phẩm mới thì người dùng cần đăng nhập để xem sp mới thì mình làm cái kiểm tra bằng token
