<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class MagicLinkNotification extends Notification
{
    use Queueable;

    public function __construct(public readonly string $url) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Sign in to reverb·manager')
            ->greeting('Sign in to reverb·manager')
            ->line('Click the button below to finish signing in. The link expires in 15 minutes and can only be used once.')
            ->action('Sign in', $this->url)
            ->line('If you did not request this, ignore this email — no action will be taken.');
    }
}
