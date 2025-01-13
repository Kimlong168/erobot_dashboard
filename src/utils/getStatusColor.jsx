const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-orange-500";
      case "processing":
        return "bg-blue-600";
      case "paid":
        return "bg-green-600";
      case "delivered":
        return "bg-pink-600";
      case "cancelled":
        return "bg-red-600";
      default:
        return "bg-gray-700";
    }
  };

export default getStatusColor;