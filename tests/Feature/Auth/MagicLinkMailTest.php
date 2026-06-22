<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use App\Notifications\MagicLinkNotification;
use Illuminate\Mail\Markdown;
use Tests\TestCase;

class MagicLinkMailTest extends TestCase
{
    private function renderMagicLinkEmail(string $url): string
    {
        $message = (new MagicLinkNotification($url))->toMail(new User(['email' => 'dev@example.com']));

        return (string) app(Markdown::class)
            ->theme($message->theme ?? config('mail.markdown.theme', 'default'))
            ->render($message->markdown, $message->data());
    }

    public function test_the_magic_link_email_uses_the_branded_reverb_theme(): void
    {
        $this->assertSame('reverb', config('mail.markdown.theme'));
    }

    public function test_the_magic_link_email_renders_the_brand_wordmark_and_signal_colour(): void
    {
        $html = $this->renderMagicLinkEmail('https://reverb.example.com/auth/magic/TOKEN');

        // Wordmark "reverberberb" (reverb + echoing "erb" tail), plus the cyan signal accent.
        $this->assertStringContainsString('reverberberb', $html);
        $this->assertStringContainsStringIgnoringCase('#00c2ff', $html);

        // Dark steel card surface is inlined onto the body table.
        $this->assertStringContainsStringIgnoringCase('#16191f', $html);
    }

    public function test_the_magic_link_email_keeps_the_call_to_action_and_footer(): void
    {
        $url = 'https://reverb.example.com/auth/magic/TOKEN';
        $html = $this->renderMagicLinkEmail($url);

        $this->assertStringContainsString('Sign in', $html);
        $this->assertStringContainsString($url, $html);
        $this->assertStringContainsString('EU-based', $html);
        $this->assertStringContainsString('/privacy', $html);
        $this->assertStringContainsString('/terms', $html);
    }
}
