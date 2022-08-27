using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;

namespace Infrastructure.Services
{
    public class OrderService : IOrderService
    {
        private readonly IBasketRepository _basketRepo;
        private readonly IPaymentService _paymentService;
        private readonly IUnitOfWork _unitOfWork;

        public OrderService(
            IUnitOfWork unitOfWork,
            IBasketRepository basketRepo,
            IPaymentService paymentService)
        {
            _unitOfWork = unitOfWork;
            _basketRepo = basketRepo;
            _paymentService = paymentService;
        }

        public async Task<Order> CreateOrderAsync(string buyerEmail, int dmId, string basketId, Address shippingAddress)
        {
            //get basket from repo
            var basket = await _basketRepo.GetBasketAsync(basketId);
            //get items from product repo
            var items = new List<OrderItem>();

            foreach(var item in basket.Items)
            {
                var productItem = await _unitOfWork.Repository<Product>().GetByIdAsync(item.Id);
                var itemOrdered = new ProductItemOrdered(productItem.Id,productItem.Name,productItem.PictureUrl);
                var orderedItem = new OrderItem(itemOrdered,productItem.Price,item.Quantity);
                items.Add(orderedItem);
            }

            //get delivery method from repo
            var deliveryMethod = await _unitOfWork.Repository<DeliveryMethod>().GetByIdAsync(dmId);

            //calc subtotal
            var subtotal = items.Sum(i => (i.Quantity * i.Price));

            //check to see if the order exists
            var spec = new OrderByPaymentIntentIdSpecification(basket.PaymentIntentId);
            var existingOrder = await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);

            // If order exists delete the order and update the Intent in stripe
            if (existingOrder != null)
            {
                _unitOfWork.Repository<Order>().Delete(existingOrder);
                await _paymentService.CreateOrUpdatePaymentIntent(basket.PaymentIntentId);
            }
            //create order
            var order = new Order(items,buyerEmail,shippingAddress,deliveryMethod,subtotal,basket.PaymentIntentId);
            _unitOfWork.Repository<Order>().Add(order);

            // save to db
            var result = await _unitOfWork.Complete();

            if(result <= 0 ) return null;

            
            return order;
        }

        public async Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync()
        {
            return await _unitOfWork.Repository<DeliveryMethod>().ListAllAsync();
        }

        public async Task<Order> GetOrderByIdAsync(int id, string buyerEmail)
        {
            var spec = new OrdersWithItemsAndOrderingSpecification(id,buyerEmail);
            return await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);
        }

        public async Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail)
        {
            var spec = new OrdersWithItemsAndOrderingSpecification(buyerEmail);
            return await _unitOfWork.Repository<Order>().ListAsync(spec);
        }
    }
}