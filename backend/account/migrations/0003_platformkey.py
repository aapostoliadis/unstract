# Generated by Django 4.2.1 on 2023-11-02 05:22

import uuid

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("account", "0002_auto_20230718_1040"),
    ]

    operations = [
        migrations.CreateModel(
            name="PlatformKey",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("key", models.UUIDField(default=uuid.uuid4)),
                (
                    "key_name",
                    models.CharField(
                        blank=True, max_length=64, null=True, unique=True
                    ),
                ),
                ("is_active", models.BooleanField(default=False)),
                (
                    "created_by",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="created_keys",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "modified_by",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="modified_keys",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "organization",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="related_org",
                        to="account.organization",
                    ),
                ),
            ],
        ),
    ]
