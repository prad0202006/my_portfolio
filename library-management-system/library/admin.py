from django.contrib import admin
from .models import Member, Book, Borrow

admin.site.register(Member)
admin.site.register(Book)
admin.site.register(Borrow)