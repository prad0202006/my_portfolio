from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import Book, Member, Borrow
from django.contrib.auth.decorators import user_passes_test


# 🟢 SIGN UP VIEW
def signup_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        email = request.POST.get('email')
        password = request.POST['password']

        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username already taken!')
        else:
            user = User.objects.create_user(username=username, email=email, password=password)
            Member.objects.create(user=user, name=username, email=email)
            messages.success(request, 'Signup successful! Please log in.')
            return redirect('login')  # 👈 redirect to login instead of home

    return render(request, 'library/signup.html')


# 🟢 LOGIN VIEW
def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']

        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            return redirect('home')
        else:
            messages.error(request, 'Invalid username or password!')
    return render(request, 'library/login.html')


# 🟢 LOGOUT VIEW
def logout_view(request):
    logout(request)
    return redirect('login')


# 🟢 HOME (Protected)
@login_required(login_url='login')
def home(request):
    return render(request, 'library/home.html')


# 🟢 BOOK LIST
@login_required(login_url='login')
def book_list(request):
    books = Book.objects.all()
    return render(request, 'library/book_list.html', {'books': books})


# 🟢 MEMBER LIST
@login_required(login_url='login')
def member_list(request):
    members = Member.objects.all()
    return render(request, 'library/member_list.html', {'members': members})


# 🟢 BORROW BOOK
@login_required(login_url='login')
def borrow_book(request):
    if request.method == 'POST':
        member_id = request.POST['member']
        book_id = request.POST['book']
        Borrow.objects.create(member_id=member_id, book_id=book_id)
        Book.objects.filter(id=book_id).update(available=False)
        return redirect('home')

    members = Member.objects.all()
    books = Book.objects.filter(available=True)
    return render(request, 'library/borrow_book.html', {'members': members, 'books': books})


# 🟢 BORROWED LIST
@login_required(login_url='login')
def borrowed_list(request):
    borrowed = Borrow.objects.select_related('member', 'book')
    return render(request, 'library/borrowed_list.html', {'borrowed': borrowed})


# Helper function to check if the user is admin/staff
def is_admin(user):
    return user.is_staff


# 🟢 ADD BOOK (Admin Only)
@user_passes_test(is_admin)
def add_book(request):
    if request.method == 'POST':
        title = request.POST['title']
        author = request.POST['author']
        isbn = request.POST['isbn']
        Book.objects.create(title=title, author=author, isbn=isbn)
        messages.success(request, 'Book added successfully!')
        return redirect('book_list')
    return render(request, 'library/add_book.html')


# 🟢 DELETE BOOK (Admin Only)
@user_passes_test(is_admin)
def delete_book(request, book_id):
    book = Book.objects.get(id=book_id)
    book.delete()
    messages.success(request, 'Book deleted successfully!')
    return redirect('book_list')

# 🟢 ADD MEMBER (Admin Only)
@user_passes_test(is_admin)
def add_member(request):
    if request.method == 'POST':
        name = request.POST['name']
        email = request.POST['email']

        # Create a corresponding User and Member record
        if User.objects.filter(username=name).exists():
            messages.error(request, 'A user with that name already exists!')
        else:
            user = User.objects.create_user(username=name, email=email, password='password123')
            user.is_staff = False  # Normal member by default
            user.save()
            Member.objects.create(user=user, name=name, email=email)
            messages.success(request, f'Member "{name}" added successfully! (default password: password123)')
        return redirect('member_list')

    return render(request, 'library/add_member.html')


# 🟢 DELETE MEMBER (Admin Only)
@user_passes_test(is_admin)
def delete_member(request, member_id):
    try:
        member = Member.objects.get(id=member_id)
        user = member.user
        member.delete()
        user.delete()  # also delete linked user account
        messages.success(request, 'Member deleted successfully!')
    except Member.DoesNotExist:
        messages.error(request, 'Member not found!')
    return redirect('member_list')
