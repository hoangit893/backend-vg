export default function hideSensitiveData(data: {
  password?: string;
  __v?: any;
  _id?: any;
  role?: string;
}) {
  if (data.password) {
    data.password = undefined;
  }
  if (data.__v) {
    data.__v = undefined;
  }
  if (data.role) {
    data.role = undefined;
  }

  if (data._id) {
    data._id = undefined;
  }

  return data;
}
