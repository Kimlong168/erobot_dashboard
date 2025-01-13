import {
  FiShoppingCart,
  FiUsers,
  FiAward,
  FiMail,
  FiUser,
} from "react-icons/fi";
import { FaSteamSymbol } from "react-icons/fa";
import { LuShoppingBasket } from "react-icons/lu";
import { FaBlog } from "react-icons/fa6";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {  PiImage } from "react-icons/pi";
import { TbCategory2 } from "react-icons/tb";
import { useContext } from "react";
import { DataContext } from "../contexts/DataContext";
const CardGroup = () => {
  const {
    productCategoryList,
    productList,
    blogCategoryList,
    blogList,
    authorList,
    memberList,
    awardList,
    partnerList,
    galleryList,
    adminList,
    orderList,
    numberOfEachOrderStatus,
  } = useContext(DataContext);
  return (
    <div className="pb-4 ">
      <p className="text-xl font-semibold mb-2">Dashboard</p>
      <div className="grid gap-4 grid-cols-1 mb-4">
        <Card
          title="Order"
          subtitle="Manage customer order"
          href="/order"
          Icon={LuShoppingBasket}
          numberOfItem={orderList.length}
          numberOfEachOrderStatus={numberOfEachOrderStatus}
        />
      </div>
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card
          title="Product"
          subtitle="Manage product"
          href="/product"
          Icon={FiShoppingCart}
          numberOfItem={productList.length}
        />
        <Card
          title="Product Category"
          subtitle="Manage product category"
          href="/productCategory"
          Icon={TbCategory2}
          numberOfItem={productCategoryList.length}
        />
        <Card
          title="Article"
          subtitle="Manage article"
          href="/blog"
          Icon={FaBlog}
          numberOfItem={blogList.length}
        />
        <Card
          title="Article Category"
          subtitle="Manage article category"
          href="/blogCategory"
          Icon={TbCategory2}
          numberOfItem={blogCategoryList.length}
        />
        <Card
          title="Author"
          subtitle="Manage author"
          href="/author"
          Icon={FiUsers}
          numberOfItem={authorList.length}
        />{" "}
        <Card
          title="Member"
          subtitle="Manage member"
          href="/member"
          Icon={FiUsers}
          numberOfItem={memberList.length}
        />
        <Card
          title="Award"
          subtitle="Manage award"
          href="/award"
          Icon={FiAward}
          numberOfItem={awardList.length}
        />
        <Card
          title="Partner"
          subtitle="Manage partner"
          href="/partner"
          Icon={FaSteamSymbol}
          numberOfItem={partnerList.length}
        />
        <Card
          title="Gallery"
          subtitle="Manage gallery"
          href="/gallery"
          Icon={PiImage}
          numberOfItem={galleryList.length}
        />
        <Card
          title="Admin"
          subtitle="Manage admin"
          href="/admin"
          Icon={FiUser}
          numberOfItem={adminList.length}
        />
        <Card
          title="Contact"
          subtitle="Manage contact"
          href="/contact"
          Icon={FiMail}
        />
      </div>
    </div>
  );
};

const Card = ({
  title,
  subtitle,
  Icon,
  href,
  numberOfItem,
  numberOfEachOrderStatus,
}) => {
  const { countNewOrder } = useContext(DataContext);
  return (
    <Link
      to={href}
      className="w-full p-4 rounded border-[1px] border-slate-300 relative overflow-hidden group bg-white group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300" />

      <Icon className="absolute z-10 -top-12 -right-12 text-9xl text-slate-100 group-hover:text-violet-400 group-hover:rotate-12 transition-transform duration-300" />
      <div className="flex items-center gap-4 mb-2 ">
        <Icon className="text-2xl text-violet-600 group-hover:text-white transition-colors relative z-10 duration-300" />
        {numberOfItem >= 0 && (
          <span className="text-red-500 ">{numberOfItem}</span>
        )}
        {numberOfItem > 0 && (
          <span className="text-red-500 flex items-center gap-5 ml-10">
            {title == "Order" && (
              <div className="z-10 grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 text-gray-900 w-full">
                <span className="p-3 py-1 w-full h-full group-hover:bg-white/70  rounded bg-violet-500/20 text-violet-500 border-violet-600 border text-xs">
                  Today: <br /> +{countNewOrder}
                </span>
                <span className="p-3 py-1 w-full h-full group-hover:bg-white/70 rounded bg-orange-500/20 text-orange-500 border-orange-600 border text-xs">
                  Pending: <br /> {numberOfEachOrderStatus.pending || 0}
                </span>
                <span className="p-3 py-1 w-full h-full group-hover:bg-white/70 rounded bg-blue-500/20 text-blue-500 border-blue-600 border text-xs">
                  Processing: <br /> {numberOfEachOrderStatus.processing || 0}
                </span>
                <span className="p-3 py-1 w-full h-full group-hover:bg-white/70 rounded bg-green-500/20 text-green-500 border-green-600 border text-xs">
                  Paid: <br /> {numberOfEachOrderStatus.paid || 0}
                </span>
                <span className="p-3 py-1 w-full h-full group-hover:bg-white/70 rounded bg-pink-500/20 text-pink-500 border-pink-600 border text-xs">
                  Delivered: <br /> {numberOfEachOrderStatus.delivered || 0}
                </span>
                <span className="p-3 py-1 w-full h-full group-hover:bg-white/70 rounded bg-red-500/20 text-red-500 border-red-600 border text-xs">
                  Cancelled: <br /> {numberOfEachOrderStatus.cancelled || 0}
                </span>
              </div>
            )}
          </span>
        )}
      </div>
      <h3 className="font-medium text-lg text-slate-950 group-hover:text-white relative z-10 duration-300">
        {title}
      </h3>
      <p className="text-slate-400 group-hover:text-violet-200 relative z-10 duration-300">
        {subtitle}
      </p>
    </Link>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  Icon: PropTypes.element,
  numberOfItem: PropTypes.number,
  numberOfEachOrderStatus: PropTypes.object,
};

export default CardGroup;
