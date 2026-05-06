from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('signup/', views.signup_view, name='signup'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),

    # Books
    path('books/', views.book_list, name='book_list'),
    path('books/add/', views.add_book, name='add_book'),
    path('books/delete/<int:book_id>/', views.delete_book, name='delete_book'),

    # Members
    path('members/', views.member_list, name='member_list'),
    path('members/add/', views.add_member, name='add_member'),
    path('members/delete/<int:member_id>/', views.delete_member, name='delete_member'),

    # Borrowing
    path('borrow/', views.borrow_book, name='borrow_book'),
    path('borrowed/', views.borrowed_list, name='borrowed_list'),
]
