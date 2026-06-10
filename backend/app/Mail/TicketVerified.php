<?php

namespace App\Mail;

use App\Models\Registration;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TicketVerified extends Mailable
{
    use Queueable, SerializesModels;

    public $registration;

    // Masukin data pendaftaran ke dalam email
    public function __construct(Registration $registration)
    {
        $this->registration = $registration;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Tiket Event INKINDO Anda Telah Aktif!',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.ticket_verified', // Nanti kita bikin file view ini
        );
    }

    public function attachments(): array
    {
        return [];
    }
}