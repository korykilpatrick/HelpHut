from pydantic import BaseModel
from typing import Optional, Union, List
from datetime import datetime
from enum import Enum

# Type alias for JSON values
Json = Union[str, int, float, bool, None, dict, list]

# Enums
class InventoryStatus(str, Enum):
    Available = "Available"
    Reserved = "Reserved"
    Distributed = "Distributed"

class TicketPriority(str, Enum):
    Urgent = "Urgent"
    Routine = "Routine"

class TicketStatus(str, Enum):
    Submitted = "Submitted"
    Scheduled = "Scheduled"
    InTransit = "InTransit"
    Delivered = "Delivered"
    Completed = "Completed"

class UserRole(str, Enum):
    Admin = "Admin"
    Donor = "Donor"
    Volunteer = "Volunteer"
    Partner = "Partner"

# -------------------------
# activity_logs Table Models
# -------------------------
class ActivityLogRow(BaseModel):
    action: str
    created_at: datetime
    id: str
    new_value: Optional[str] = None
    old_value: Optional[str] = None
    record_id: Optional[str] = None
    table_name: str
    user_id: Optional[str] = None

class ActivityLogInsert(BaseModel):
    action: str
    created_at: Optional[datetime] = None
    id: Optional[str] = None
    new_value: Optional[str] = None
    old_value: Optional[str] = None
    record_id: Optional[str] = None
    table_name: str
    user_id: Optional[str] = None

class ActivityLogUpdate(BaseModel):
    action: Optional[str] = None
    created_at: Optional[datetime] = None
    id: Optional[str] = None
    new_value: Optional[str] = None
    old_value: Optional[str] = None
    record_id: Optional[str] = None
    table_name: Optional[str] = None
    user_id: Optional[str] = None

# -------------------------
# donations Table Models
# -------------------------
class DonationsRow(BaseModel):
    created_at: datetime
    donated_at: datetime
    donor_id: Optional[str] = None
    expiration_date: Optional[datetime] = None
    food_type_id: Optional[str] = None
    id: str
    is_fragile: bool
    notes: Optional[str] = None
    pickup_window_end: datetime
    pickup_window_start: datetime
    quantity: float
    requires_freezing: bool
    requires_heavy_lifting: bool
    requires_refrigeration: bool
    storage_requirements: Optional[str] = None
    unit: str
    updated_at: datetime

class DonationsInsert(BaseModel):
    created_at: Optional[datetime] = None
    donated_at: Optional[datetime] = None
    donor_id: Optional[str] = None
    expiration_date: Optional[datetime] = None
    food_type_id: Optional[str] = None
    id: Optional[str] = None
    is_fragile: Optional[bool] = None
    notes: Optional[str] = None
    pickup_window_end: datetime
    pickup_window_start: datetime
    quantity: Optional[float] = None
    requires_freezing: Optional[bool] = None
    requires_heavy_lifting: Optional[bool] = None
    requires_refrigeration: Optional[bool] = None
    storage_requirements: Optional[str] = None
    unit: Optional[str] = None
    updated_at: Optional[datetime] = None

class DonationsUpdate(BaseModel):
    created_at: Optional[datetime] = None
    donated_at: Optional[datetime] = None
    donor_id: Optional[str] = None
    expiration_date: Optional[datetime] = None
    food_type_id: Optional[str] = None
    id: Optional[str] = None
    is_fragile: Optional[bool] = None
    notes: Optional[str] = None
    pickup_window_end: Optional[datetime] = None
    pickup_window_start: Optional[datetime] = None
    quantity: Optional[float] = None
    requires_freezing: Optional[bool] = None
    requires_heavy_lifting: Optional[bool] = None
    requires_refrigeration: Optional[bool] = None
    storage_requirements: Optional[str] = None
    unit: Optional[str] = None
    updated_at: Optional[datetime] = None

# -------------------------
# donors Table Models
# -------------------------
class DonorsRow(BaseModel):
    business_hours: Optional[str] = None
    created_at: datetime
    id: str
    location_id: Optional[str] = None
    organization_name: str
    phone: str
    pickup_preferences: Optional[str] = None
    updated_at: datetime
    user_id: Optional[str] = None

class DonorsInsert(BaseModel):
    business_hours: Optional[str] = None
    created_at: Optional[datetime] = None
    id: Optional[str] = None
    location_id: Optional[str] = None
    organization_name: str
    phone: str
    pickup_preferences: Optional[str] = None
    updated_at: Optional[datetime] = None
    user_id: Optional[str] = None

class DonorsUpdate(BaseModel):
    business_hours: Optional[str] = None
    created_at: Optional[datetime] = None
    id: Optional[str] = None
    location_id: Optional[str] = None
    organization_name: Optional[str] = None
    phone: Optional[str] = None
    pickup_preferences: Optional[str] = None
    updated_at: Optional[datetime] = None
    user_id: Optional[str] = None

# -------------------------
# food_types Table Models
# -------------------------
class FoodTypesRow(BaseModel):
    created_at: datetime
    id: str
    name: str
    updated_at: datetime

class FoodTypesInsert(BaseModel):
    created_at: Optional[datetime] = None
    id: Optional[str] = None
    name: str
    updated_at: Optional[datetime] = None

class FoodTypesUpdate(BaseModel):
    created_at: Optional[datetime] = None
    id: Optional[str] = None
    name: Optional[str] = None
    updated_at: Optional[datetime] = None

# -------------------------
# inventory Table Models
# -------------------------
class InventoryRow(BaseModel):
    created_at: datetime
    donation_id: Optional[str] = None
    expiration_date: Optional[datetime] = None
    food_type_id: Optional[str] = None
    id: str
    partner_org_id: Optional[str] = None
    quantity: float
    status: InventoryStatus
    unit: str
    updated_at: datetime

class InventoryInsert(BaseModel):
    created_at: Optional[datetime] = None
    donation_id: Optional[str] = None
    expiration_date: Optional[datetime] = None
    food_type_id: Optional[str] = None
    id: Optional[str] = None
    partner_org_id: Optional[str] = None
    quantity: Optional[float] = None
    status: Optional[InventoryStatus] = None
    unit: Optional[str] = None
    updated_at: Optional[datetime] = None

class InventoryUpdate(BaseModel):
    created_at: Optional[datetime] = None
    donation_id: Optional[str] = None
    expiration_date: Optional[datetime] = None
    food_type_id: Optional[str] = None
    id: Optional[str] = None
    partner_org_id: Optional[str] = None
    quantity: Optional[float] = None
    status: Optional[InventoryStatus] = None
    unit: Optional[str] = None
    updated_at: Optional[datetime] = None

# -------------------------
# locations Table Models
# -------------------------
class LocationsRow(BaseModel):
    city: Optional[str] = None
    created_at: datetime
    id: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    state: Optional[str] = None
    street: Optional[str] = None
    updated_at: datetime
    zip: Optional[str] = None

class LocationsInsert(BaseModel):
    city: Optional[str] = None
    created_at: Optional[datetime] = None
    id: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    state: Optional[str] = None
    street: Optional[str] = None
    updated_at: Optional[datetime] = None
    zip: Optional[str] = None

class LocationsUpdate(BaseModel):
    city: Optional[str] = None
    created_at: Optional[datetime] = None
    id: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    state: Optional[str] = None
    street: Optional[str] = None
    updated_at: Optional[datetime] = None
    zip: Optional[str] = None

# -------------------------
# partners Table Models
# -------------------------
class PartnersRow(BaseModel):
    capacity: Optional[float] = None
    contact_email: str
    contact_phone: str
    created_at: datetime
    id: str
    location_id: Optional[str] = None
    max_capacity: Optional[float] = None
    name: str
    updated_at: datetime
    user_id: Optional[str] = None

class PartnersInsert(BaseModel):
    capacity: Optional[float] = None
    contact_email: str
    contact_phone: str
    created_at: Optional[datetime] = None
    id: Optional[str] = None
    location_id: Optional[str] = None
    max_capacity: Optional[float] = None
    name: str
    updated_at: Optional[datetime] = None
    user_id: Optional[str] = None

class PartnersUpdate(BaseModel):
    capacity: Optional[float] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    created_at: Optional[datetime] = None
    id: Optional[str] = None
    location_id: Optional[str] = None
    max_capacity: Optional[float] = None
    name: Optional[str] = None
    updated_at: Optional[datetime] = None
    user_id: Optional[str] = None

# -------------------------
# shifts Table Models
# -------------------------
class ShiftsRow(BaseModel):
    created_at: datetime
    end_time: datetime
    id: str
    shift_date: datetime
    start_time: datetime
    updated_at: datetime
    volunteer_id: str

class ShiftsInsert(BaseModel):
    created_at: Optional[datetime] = None
    end_time: datetime
    id: Optional[str] = None
    shift_date: datetime
    start_time: datetime
    updated_at: Optional[datetime] = None
    volunteer_id: str

class ShiftsUpdate(BaseModel):
    created_at: Optional[datetime] = None
    end_time: Optional[datetime] = None
    id: Optional[str] = None
    shift_date: Optional[datetime] = None
    start_time: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    volunteer_id: Optional[str] = None

# -------------------------
# ticket_attachments Table Models
# -------------------------
class TicketAttachmentsRow(BaseModel):
    attachment: str
    created_at: datetime
    id: str
    ticket_id: str
    updated_at: datetime

class TicketAttachmentsInsert(BaseModel):
    attachment: str
    created_at: Optional[datetime] = None
    id: Optional[str] = None
    ticket_id: str
    updated_at: Optional[datetime] = None

class TicketAttachmentsUpdate(BaseModel):
    attachment: Optional[str] = None
    created_at: Optional[datetime] = None
    id: Optional[str] = None
    ticket_id: Optional[str] = None
    updated_at: Optional[datetime] = None

# -------------------------
# ticket_notes Table Models
# -------------------------
class TicketNotesRow(BaseModel):
    created_at: datetime
    id: str
    note: str
    ticket_id: str
    updated_at: datetime

class TicketNotesInsert(BaseModel):
    created_at: Optional[datetime] = None
    id: Optional[str] = None
    note: str
    ticket_id: str
    updated_at: Optional[datetime] = None

class TicketNotesUpdate(BaseModel):
    created_at: Optional[datetime] = None
    id: Optional[str] = None
    note: Optional[str] = None
    ticket_id: Optional[str] = None
    updated_at: Optional[datetime] = None

# -------------------------
# ticket_tags Table Models
# -------------------------
class TicketTagsRow(BaseModel):
    created_at: datetime
    id: str
    tag: str
    ticket_id: str
    updated_at: datetime

class TicketTagsInsert(BaseModel):
    created_at: Optional[datetime] = None
    id: Optional[str] = None
    tag: str
    ticket_id: str
    updated_at: Optional[datetime] = None

class TicketTagsUpdate(BaseModel):
    created_at: Optional[datetime] = None
    id: Optional[str] = None
    tag: Optional[str] = None
    ticket_id: Optional[str] = None
    updated_at: Optional[datetime] = None

# -------------------------
# tickets Table Models
# -------------------------
class TicketsRow(BaseModel):
    completed_at: Optional[datetime] = None
    created_at: datetime
    donation_id: Optional[str] = None
    dropoff_location_id: Optional[str] = None
    id: str
    partner_org_id: Optional[str] = None
    pickup_location_id: Optional[str] = None
    priority: TicketPriority
    status: TicketStatus
    updated_at: datetime
    volunteer_id: Optional[str] = None

class TicketsInsert(BaseModel):
    completed_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    donation_id: Optional[str] = None
    dropoff_location_id: Optional[str] = None
    id: Optional[str] = None
    partner_org_id: Optional[str] = None
    pickup_location_id: Optional[str] = None
    priority: Optional[TicketPriority] = None
    status: Optional[TicketStatus] = None
    updated_at: Optional[datetime] = None
    volunteer_id: Optional[str] = None

class TicketsUpdate(BaseModel):
    completed_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    donation_id: Optional[str] = None
    dropoff_location_id: Optional[str] = None
    id: Optional[str] = None
    partner_org_id: Optional[str] = None
    pickup_location_id: Optional[str] = None
    priority: Optional[TicketPriority] = None
    status: Optional[TicketStatus] = None
    updated_at: Optional[datetime] = None
    volunteer_id: Optional[str] = None

# -------------------------
# users Table Models
# -------------------------
class UsersRow(BaseModel):
    created_at: datetime
    display_name: str
    id: str
    role: UserRole
    updated_at: datetime

class UsersInsert(BaseModel):
    created_at: Optional[datetime] = None
    display_name: str
    id: str
    role: UserRole
    updated_at: Optional[datetime] = None

class UsersUpdate(BaseModel):
    created_at: Optional[datetime] = None
    display_name: Optional[str] = None
    id: Optional[str] = None
    role: Optional[UserRole] = None
    updated_at: Optional[datetime] = None

# -------------------------
# volunteer_availability_time Table Models
# -------------------------
class VolunteerAvailabilityTimeRow(BaseModel):
    created_at: datetime
    day_of_week: int
    end_time: str
    id: str
    start_time: str
    updated_at: datetime
    volunteer_id: str

class VolunteerAvailabilityTimeInsert(BaseModel):
    created_at: Optional[datetime] = None
    day_of_week: int
    end_time: str
    id: Optional[str] = None
    start_time: str
    updated_at: Optional[datetime] = None
    volunteer_id: str

class VolunteerAvailabilityTimeUpdate(BaseModel):
    created_at: Optional[datetime] = None
    day_of_week: Optional[int] = None
    end_time: Optional[str] = None
    id: Optional[str] = None
    start_time: Optional[str] = None
    updated_at: Optional[datetime] = None
    volunteer_id: Optional[str] = None

# -------------------------
# volunteer_availability_zones Table Models
# -------------------------
class VolunteerAvailabilityZonesRow(BaseModel):
    created_at: datetime
    id: str
    updated_at: datetime
    volunteer_id: str
    zone: str

class VolunteerAvailabilityZonesInsert(BaseModel):
    created_at: Optional[datetime] = None
    id: Optional[str] = None
    updated_at: Optional[datetime] = None
    volunteer_id: str
    zone: str

class VolunteerAvailabilityZonesUpdate(BaseModel):
    created_at: Optional[datetime] = None
    id: Optional[str] = None
    updated_at: Optional[datetime] = None
    volunteer_id: Optional[str] = None
    zone: Optional[str] = None

# -------------------------
# volunteer_skills Table Models
# -------------------------
class VolunteerSkillsRow(BaseModel):
    created_at: datetime
    id: str
    skill: str
    updated_at: datetime
    volunteer_id: str

class VolunteerSkillsInsert(BaseModel):
    created_at: Optional[datetime] = None
    id: Optional[str] = None
    skill: str
    updated_at: Optional[datetime] = None
    volunteer_id: str

class VolunteerSkillsUpdate(BaseModel):
    created_at: Optional[datetime] = None
    id: Optional[str] = None
    skill: Optional[str] = None
    updated_at: Optional[datetime] = None
    volunteer_id: Optional[str] = None

# -------------------------
# volunteers Table Models
# -------------------------
class VolunteersRow(BaseModel):
    created_at: datetime
    id: str
    location_id: Optional[str] = None
    phone: str
    updated_at: datetime
    user_id: Optional[str] = None
    vehicle_type: Optional[str] = None

class VolunteersInsert(BaseModel):
    created_at: Optional[datetime] = None
    id: Optional[str] = None
    location_id: Optional[str] = None
    phone: str
    updated_at: Optional[datetime] = None
    user_id: Optional[str] = None
    vehicle_type: Optional[str] = None

class VolunteersUpdate(BaseModel):
    created_at: Optional[datetime] = None
    id: Optional[str] = None
    location_id: Optional[str] = None
    phone: Optional[str] = None
    updated_at: Optional[datetime] = None
    user_id: Optional[str] = None
    vehicle_type: Optional[str] = None
