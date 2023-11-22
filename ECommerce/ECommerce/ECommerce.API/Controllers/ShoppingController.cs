using ECommerce.API.DataAccess;
using ECommerce.API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShoppingController : ControllerBase
    {
        readonly IDataAccess dataAccess;
        private readonly string DateFormat;
        public ShoppingController(IDataAccess dataAccess, IConfiguration configuration)
        {
            this.dataAccess = dataAccess;
            DateFormat = configuration["Constants:DateFormat"];
        }

        [HttpGet("GetCategoryList")]
        public IActionResult GetCategoryList()
        {
            var result = dataAccess.GetProductCategories();
            return Ok(result);
        }

        [HttpGet("GetAlls")]
        public IActionResult GetAlls()        {
            var result = dataAccess.GetAlls();
            return Ok(result);
        }

        [HttpGet("GetProducts")]
        public IActionResult GetProducts(string category, string subcategory, int count)
        {
            var result = dataAccess.GetProducts(category, subcategory, count);
            return Ok(result);
        }

        [HttpGet("GetProduct/{id}")]
        public IActionResult GetProduct(int id)
        {
            var result = dataAccess.GetProduct(id);
            return Ok(result);
        }

        [HttpPost("AddProduct")]
        public IActionResult AddProduct([FromBody] Product product)
        {
            var result = dataAccess.InsertProduct(product);

            string? message;
            if (result) message = "Thêm thành công";
            else message = "Thêm thất bại";
            return Ok(message);
        }

        [HttpPost("RegisterUser")]
        public IActionResult RegisterUser([FromBody] User user)
        {
            user.CreatedAt = DateTime.Now.ToString(DateFormat);
            user.ModifiedAt = DateTime.Now.ToString(DateFormat);

            var result = dataAccess.InsertUser(user);

            string? message;
            if (result) message = "Đăng ký thành công";
            else message = "Email đã tồn tại";
            return Ok(message);
        }

        [HttpPost("LoginUser")]
        public IActionResult LoginUser([FromBody] User user)
        {
            var token = dataAccess.IsUserPresent(user.Email, user.Password);
            if (token == "") token = "invalid";
            if (token != "invalid" && user.Email != "gabayan170@gmail.com") token = "no-permission";
            return Ok(token);
        }

        [HttpPost("InsertReview")]
        public IActionResult InsertReview([FromBody] Review review)
        {
            review.CreatedAt = DateTime.Now.ToString(DateFormat);
            dataAccess.InsertReview(review);
            return Ok("inserted");
        }

        [HttpGet("GetProductReviews/{productId}")]
        public IActionResult GetProductReviews(int productId)
        {
            var result = dataAccess.GetProductReviews(productId);
            return Ok(result);
        }

        [HttpPost("InsertCartItem/{userid}/{productid}")]
        public IActionResult InsertCartItem(int userid, int productid)
        {
            var result = dataAccess.InsertCartItem(userid, productid);
            return Ok(result ? "inserted" : "not inserted");
        }

        [HttpGet("GetActiveCartOfUser/{id}")]
        public IActionResult GetActiveCartOfUser(int id)
        {
            var result = dataAccess.GetActiveCartOfUser(id);
            return Ok(result);
        }

        [HttpGet("GetAllPreviousCartsOfUser/{id}")]
        public IActionResult GetAllPreviousCartsOfUser(int id)
        {
            var result = dataAccess.GetAllPreviousCartsOfUser(id);
            return Ok(result);
        }

        [HttpGet("GetPaymentMethods")]
        public IActionResult GetPaymentMethods()
        {
            var result = dataAccess.GetPaymentMethods();
            return Ok(result);
        }

        [HttpPost("InsertPayment")]
        public IActionResult InsertPayment(Payment payment)
        {
            payment.CreatedAt = DateTime.Now.ToString();
            var id = dataAccess.InsertPayment(payment);
            return Ok(id.ToString());
        }

        [HttpPost("InsertOrder")]
        public IActionResult InsertOrder(Order order)
        {
            order.CreatedAt = DateTime.Now.ToString();
            var id = dataAccess.InsertOrder(order);
            return Ok(id.ToString());
        }

        [HttpGet("User/{id}")]
        public IActionResult GetUser(int id)
        {
            var result = dataAccess.GetUser(id);
            return Ok(result);
        }
        [HttpGet("User")]
        public IActionResult GetAllUser()
        {
            var result = dataAccess.GetAllUser();
            return Ok(result);
        }
        [HttpGet("SearchProduct")]
        public IActionResult SearchProductsByTitle(string title)
        {
            // Kiểm tra xem chuỗi tên sản phẩm được cung cấp có hợp lệ hay không
            if (string.IsNullOrWhiteSpace(title))
            {
                return BadRequest("Product name cannot be empty.");
            }

            try
            {
                // Tạo đối tượng DataAccess để thực hiện tìm kiếm

                // Gọi phương thức SearchProductsByName của DataAccess để lấy danh sách sản phẩm khớp với tên
                var searchResults = dataAccess.SearchProductsByTitle(title);

                // Trả về kết quả tìm kiếm dưới dạng JSON
                return Ok(searchResults);
            }
            catch (Exception ex)
            {
                // Xử lý lỗi nếu có
                return StatusCode(500, $"An error occurred while searching for products: {ex.Message}");
            }
        }

        [HttpDelete("DeleteProduct/{productId}")]
        public IActionResult DeleteCartItem(int productId)
        {
            bool isDeleted = dataAccess.DeleteProduct(productId);
            if (isDeleted)
            {
                return Ok();
            }
            else
            {
                return NotFound("Không tìm thấy sản phẩm");
            }
        }

        [HttpDelete("deleteCartItem/{userId}/{cartItemId}")]
        public IActionResult DeleteCartItem(int userId, int cartItemId)
        {
            bool isDeleted = dataAccess.DeleteCartItem(userId, cartItemId);
            if (isDeleted)
            {
                var result = dataAccess.GetActiveCartOfUser(userId);
                return Ok(result);
            }
            else
            {
                return NotFound("Cart item not found or doesn't belong to the user.");
            }
        }

    }
}
